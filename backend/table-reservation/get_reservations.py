import functions_framework
import firebase_admin
from firebase_admin import credentials, firestore
import json

cred = credentials.Certificate('serviceAccount.json')

app = firebase_admin.initialize_app(cred)
db = firestore.client()
from firebase_functions import https_fn, options

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get"],
    )
)
@functions_framework.http
def get_reservations(request):

    try:
        users_ref = db.collection("Reservation")
        docs = users_ref.stream()
        doc_data = []
        for doc in docs:
            document_dict = doc.to_dict()
            document_dict['reservation_id'] = doc.id
            doc_data.append(document_dict)

        #print(json_data)
        return {
            "ok": "true",
            "data": doc_data,
            "status_code": 200 
        }
    except Exception as e:
        return {
            "ok": "false",
            "message": f"Could not retrieve data!: {e}",
            "status_code": 500
        }
