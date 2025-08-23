from flask import Flask
from flask_cors import CORS

from routers.azure_speech import azure_router
from routers.sample import sample_router

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = '*'

app.register_blueprint(sample_router)
app.register_blueprint(azure_router)

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=3000)