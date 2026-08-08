"""Compatibility entrypoint for ``uvicorn main:app``.

The application is implemented in :mod:`app.main`; keeping this module avoids
starting the retired OpenAI/rule-based route set by accident.
"""

from app.main import app

__all__ = ["app"]
