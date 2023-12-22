import functions_framework
import firebase_admin
import pendulum
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from google.cloud.firestore_v1.base_query import FieldFilter

cred = credentials.Certificate('serviceAccount.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["post", "delete"],
    )
)
@functions_framework.http
def delete_reservation(request):

    try:
        request_data = request.get_json()
        id1 = request_data.get("reservation_id")
        print(id1)
        reservations_ref = db.collection("Reservation")
        doc_ref = reservations_ref.document(id1)
        doc = doc_ref.get()
        
        if doc.exists:

            curr_datetime = pendulum.now().in_timezone("America/Halifax").format("YYYY-MM-DD HH:mm:ss")
            curr_date = curr_datetime.split(" ")[0]
            ch, cm, cs = curr_datetime.split(" ")[-1].split(":")
            data = doc_ref.get().to_dict()
            if data["date"] == curr_date:
                time = data["time"].split("-")[0]
                rh,rm = time.split(":")
                curr_time = pendulum.time(int(ch),int(cm),int(cs))
                reservation_time = pendulum.time(int(rh),int(rm),0)
                time_diff_arr = reservation_time.diff_for_humans(curr_time).split(" ")
                if time_diff_arr[2] == "before" or time_diff_arr[1] in ["seconds", "minutes", "second", "minute"]:
                    return {
                        "ok": "true",
                        "message": f"You Cannot delete a reservation before an hour!",
                        "status_code": 200
                    }
                
            db.collection("Reservation").document(id1).delete()
            return {
                "ok": "true",
                "message": "Successfully deleted the reservation!",
                "reservation_id": id1,
                "status_code": 200
            }     
        else:
            return {
                "ok": "false",
                "message": f"Could not find reservation with ID: {id1}",
                "status_code": 400
            }

    except Exception as e:

        return {
            "ok": "false",
            "message": f"Could not delete reservation!: {e}",
            "status_code": 500
        }