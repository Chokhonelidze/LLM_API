FROM python as base 

#RUN pip install pipenv

RUN pip install psycopg2-binary

ENV PROJECT_DIR /usr/local/src/webapp
ENV SRC_DIR ${PROJECT_DIR}/api

COPY requirements.txt ${PROJECT_DIR}/

COPY app.py ${PROJECT_DIR}/

WORKDIR ${PROJECT_DIR}

ENV PYTHONUNBUFFERED=1

FROM base as dev

#RUN pipenv install --system --dev

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# RUN python -m pip install git+https://github.com/pytube/pytube


COPY  ./api ${SRC_DIR}

WORKDIR ${PROJECT_DIR}

EXPOSE 5000

CMD ["flask","run","-h", "0.0.0.0"]




