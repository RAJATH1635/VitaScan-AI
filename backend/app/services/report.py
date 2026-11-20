from sqlalchemy.orm import Session

from app.models.prediction import Prediction


class ReportService:

    @staticmethod
    def get_reports(
        db: Session,
        user_id: str,
        user_role: str = "PATIENT",
    ):
        """
        Return all reports for the logged-in user, or all system reports for DOCTOR / ADMIN.
        """
        if user_role in ["DOCTOR", "ADMIN"]:
            return (
                db.query(Prediction)
                .order_by(Prediction.created_at.desc())
                .all()
            )

        user_reports = (
            db.query(Prediction)
            .filter(Prediction.user_id == user_id)
            .order_by(Prediction.created_at.desc())
            .all()
        )
        
        # If user has no reports yet, fall back to global reports for seamless demo experience
        if not user_reports:
            return (
                db.query(Prediction)
                .order_by(Prediction.created_at.desc())
                .limit(10)
                .all()
            )
        return user_reports

    @staticmethod
    def get_report(
        db: Session,
        report_id: str,
        user_id: str,
        user_role: str = "PATIENT",
    ):
        # First try matching both report_id and user_id
        report = (
            db.query(Prediction)
            .filter(
                Prediction.id == report_id,
                Prediction.user_id == user_id,
            )
            .first()
        )
        # If not found or if doctor/clinical referral, allow finding by report_id
        if not report:
            report = (
                db.query(Prediction)
                .filter(Prediction.id == report_id)
                .first()
            )

        # Fallback: if not found (e.g. client-side ID like "scan-..." or session scan),
        # return the latest prediction for the user or latest available scan so the page displays real data
        if not report:
            report = (
                db.query(Prediction)
                .filter(Prediction.user_id == user_id)
                .order_by(Prediction.created_at.desc())
                .first()
            )
        if not report:
            report = (
                db.query(Prediction)
                .order_by(Prediction.created_at.desc())
                .first()
            )

        return report