from flask import Blueprint, request, jsonify
from pydantic import BaseModel

from actions import getSample

sample_router = Blueprint('sample', __name__, url_prefix='/api/sample')

class SampleRequest(BaseModel):
  category: int
  language: str

@sample_router.route('/get', methods=['POST'])
def getSampleController():
  try:
    data = SampleRequest(**request.get_json(force=True))

    return getSample.handler(data.category, data.language)
      
  except BaseModel as e:
    return jsonify({"error": "Invalid request body", "details": e.errors()}), 400
  except Exception as e:
    return jsonify({"error": str(e)}), 500