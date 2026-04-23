from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.protected import router as protected_router

app = FastAPI(title="JWT Auth Demo")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(protected_router, prefix="/api", tags=["protected"])


@app.get("/")
def root():
    return {"message": "JWT Auth Demo — see /docs for API reference"}
