"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Backend API settings."""

    database_url: str = "postgresql+asyncpg://localhost/todo"
    dapr_http_port: int = 3500
    openai_api_key: str = ""
    backend_api_url: str = "http://localhost:8000"

    @property
    def dapr_base_url(self) -> str:
        return f"http://localhost:{self.dapr_http_port}"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
