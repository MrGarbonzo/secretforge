FROM python:3.12

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Expose port (mapped to 80 externally)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:3000/api/health')"

# Run application with standard uvloop
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]
