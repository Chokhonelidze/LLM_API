FROM python as base 

#RUN pip install pipenv

RUN pip install psycopg2-binary

ENV PROJECT_DIR /usr/local/src/app
ENV SRC_DIR ${PROJECT_DIR}/api

COPY requirements.txt ${PROJECT_DIR}/

COPY app.py ${PROJECT_DIR}/

COPY gunicorn_config.py ${PROJECT_DIR}/

ADD ./api ${SRC_DIR}

WORKDIR ${PROJECT_DIR}

ENV PYTHONUNBUFFERED=1

FROM base as dev

#RUN pipenv install --system --dev

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# RUN python -m pip install git+https://github.com/pytube/pytube



WORKDIR ${PROJECT_DIR}

EXPOSE 8080

#CMD ["flask","--debug","run","-h", "0.0.0.0"]

CMD ["gunicorn","--config","gunicorn_config.py", "app:app","--reload ", "--reload-engine inotify"]



