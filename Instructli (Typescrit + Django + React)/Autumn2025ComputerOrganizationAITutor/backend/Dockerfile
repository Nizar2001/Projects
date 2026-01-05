FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    qtbase5-dev \
    libqt5charts5-dev \
    libqt5svg5-dev \
    libgl1-mesa-dev \
    && rm -rf /var/lib/apt/lists/*
ENV QT_QPA_PLATFORM=offscreen

COPY . /app/

EXPOSE 8000

CMD ["/bin/sh", "run.sh"]