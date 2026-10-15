from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api import deps
from app.core.database import get_db
from app.models.user import User
from app.models.domain import Notification
from app.core.timezone import utc_now, format_iso_utc

router = APIRouter()


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    is_read: bool
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


def seed_default_notifications_if_empty(db: Session, user: User) -> List[Notification]:
    existing = db.query(Notification).filter_by(user_id=user.id).all()
    if existing:
        return existing

    # Create helpful default notifications based on role
    now = utc_now()
    defaults = []

    if user.role == "DOCTOR":
        defaults = [
            Notification(
                id=str(uuid.uuid4()),
                user_id=user.id,
                title="New Patient Appointment Scheduled",
                message="Patient RAJATH B G has scheduled an appointment with you for a Dementia & Cognitive Health Review.",
                is_read=False,
                created_at=now,
            ),
            Notification(
                id=str(uuid.uuid4()),
                user_id=user.id,
                title="AI Screening Awaiting Validation",
                message="A new brain MRI screening with high confidence (96.4%) is pending your clinical validation.",
                is_read=False,
                created_at=now,
            ),
            Notification(
                id=str(uuid.uuid4()),
                user_id=user.id,
                title="Medical Staff Workspace Active",
                message="Your physician credentials are verified. You have access to patient histories, consultation notes, and prescriptions.",
                is_read=True,
                created_at=now,
            ),
        ]
    else:
        defaults = [
            Notification(
                id=str(uuid.uuid4()),
                user_id=user.id,
                title="AI Screening Analysis Complete",
                message="Your brain MRI scan has been processed with 96.4% confidence. 3 recommended specialists are ready for review.",
                is_read=False,
                created_at=now,
            ),
            Notification(
                id=str(uuid.uuid4()),
                user_id=user.id,
                title="Appointment Confirmed",
                message="Your consultation with Dr. Ramesh Iyer at Manipal Hospital, Bengaluru has been confirmed.",
                is_read=False,
                created_at=now,
            ),
            Notification(
                id=str(uuid.uuid4()),
                user_id=user.id,
                title="Doctor Referral Network Available",
                message="12 specialist doctors in Bengaluru, Mumbai, Chennai, and other locations are available for in-person or teleconsultation.",
                is_read=True,
                created_at=now,
            ),
        ]

    for n in defaults:
        db.add(n)
    db.commit()

    return db.query(Notification).filter_by(user_id=user.id).order_by(Notification.created_at.desc()).all()


@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    items = db.query(Notification).filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).all()
    if not items:
        items = seed_default_notifications_if_empty(db, current_user)

    return [
        NotificationResponse(
            id=item.id,
            user_id=item.user_id,
            title=item.title,
            message=item.message,
            is_read=item.is_read,
            created_at=format_iso_utc(item.created_at) if item.created_at else None,
        )
        for item in items
    ]


@router.post("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    item = db.query(Notification).filter_by(id=notification_id, user_id=current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")

    item.is_read = True
    db.commit()
    db.refresh(item)

    return NotificationResponse(
        id=item.id,
        user_id=item.user_id,
        title=item.title,
        message=item.message,
        is_read=item.is_read,
        created_at=format_iso_utc(item.created_at) if item.created_at else None,
    )


@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    db.query(Notification).filter_by(user_id=current_user.id).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read."}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    item = db.query(Notification).filter_by(id=notification_id, user_id=current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")

    db.delete(item)
    db.commit()
    return {"message": "Notification deleted."}


@router.delete("")
def clear_all_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    db.query(Notification).filter_by(user_id=current_user.id).delete()
    db.commit()
    return {"message": "All notifications cleared."}
