import functions_framework
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from google.cloud.firestore_v1.base_query import FieldFilter


cred = credentials.Certificate('serviceAccount.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["post", "put"],
    )
)
@functions_framework.http
def update_status(request):

    try:
        request_data = request.get_json()
        if not request_data:
            return {
                "ok": "false",
                "message": "Request body is required",
                "status_code": 400
            }

        reservation_id = request_data.get("reservation_id")
        if not reservation_id:
            return {
                "ok": "false",
                "message": "Reservation ID is required",
                "status_code": 400
            }

        status = request_data.get("status")
        if not status:
            return {
                "ok": "false",
                "message": "Status is required",
                "status_code": 400
            }

        if status.lower() in ["accepted", "confirmed"]:
            
            reservations_ref = db.collection("Reservation")
            doc_ref = reservations_ref.document(reservation_id)
            doc = doc_ref.get()
            if doc.exists:
                doc_ref.update({"status": "accepted"})
                return {
                    "ok": "true",
                    "message": "Successfully updated the status!",
                    "reservation_id": reservation_id,
                    "status_code": 200
                }     
            else:
                return {
                    "ok": "false",
                    "message": f"Could not find reservation with ID: {reservation_id}",
                    "status_code": 400
                }
        
        elif status.lower() in ["rejected", "declined"]:
            reservations_ref = db.collection("Reservation")
            doc_ref = reservations_ref.document(reservation_id)
            doc = doc_ref.get()
            if doc.exists:
                doc_ref.update({"status": "rejected"})
                return {
                    "ok": "true",
                    "message": "Successfully updated the status!",
                    "reservation_id": reservation_id,
                    "status_code": 200
                }     
            else:
                return {
                    "ok": "false",
                    "message": f"Could not find reservation with ID: {reservation_id}",
                    "status_code": 400
                }
            
    except Exception as e:

        return {
            "ok": "false",
            "message": f"Could not update status!: {e}",
            "status_code": 500
        }
