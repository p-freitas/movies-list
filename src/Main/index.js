import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./main.css";
import moment from "moment";
import {
  Col,
  Row,
  Button,
  List,
  Form,
  message,
  Input,
  Typography,
  DatePicker,
  Modal,
} from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import "moment/locale/pt-br";

import Github from "../assets/github.png";
import axios from "axios";

const { Title } = Typography;

export default function Main() {
  const [data, setData] = useState([]);
  const [dataSeries, setDataSeries] = useState([]);
  const [dataRecomendation, setDataRecomendation] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [loadingRecomendations, setLoadingRecomendations] = useState(false);
  const [moviesInputValue, setMoviesInputValue] = useState("");
  const [seriesInputValue, setSeriesInputValue] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;
  const currentTime = moment().format("DD/MM/YYYY HH:mm:ss");
  const time = localStorage.getItem("lastUpdated");

  const convertDate = (date) => {
    var dateString =
      date.substr(6, 4) + "/" + date.substr(3, 2) + "/" + date.substr(0, 2);
    return new Date(dateString);
  };

  const getMovies = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/movies`)
      .then(function (response) {
        const orderedResponse = response.data.sort(function (a, b) {
          var key1 = new Date(convertDate(a.date));
          var key2 = new Date(convertDate(b.date));

          if (key1 < key2) {
            return -1;
          } else if (key1 === key2) {
            return 0;
          } else {
            return 1;
          }
        });
        setData([...data, orderedResponse]);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getSeries = () => {
    setLoadingSeries(true);
    axios
      .get(`${API_URL}/series`)
      .then(function (response) {
        const orderedResponse = response.data.sort(function (a, b) {
          var key1 = new Date(convertDate(a.date));
          var key2 = new Date(convertDate(b.date));

          if (key1 < key2) {
            return -1;
          } else if (key1 === key2) {
            return 0;
          } else {
            return 1;
          }
        });
        setDataSeries([...data, orderedResponse]);
        setLoadingSeries(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getRecomendation = () => {
    setLoadingRecomendations(true);
    axios
      .get(`${API_URL}/recomendations`)
      .then(function (response) {
        setDataRecomendation([...data, response.data]);
        setLoadingRecomendations(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getMovies();
    getSeries();
    getRecomendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form] = Form.useForm();
  const [formSerie] = Form.useForm();
  const [formRecomendations] = Form.useForm();

  const onReset = () => {
    form.resetFields();
    formSerie.resetFields();
    formRecomendations.resetFields();
  };

  const onFinish = (values) => {
    if (values.movieName === undefined || values.movieDate === undefined) {
      message.warning("Preencha os campos do filme");
    } else {
      axios
        .post(`${API_URL}/movies`, {
          name: values.movieName,
          date: values.movieDate.format("DD/MM/YYYY"),
        })
        .then(function (response) {
          getMovies();
          onReset();
          localStorage.setItem("lastUpdated", currentTime);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onFinishSeries = (values) => {
    if (values.serieName === undefined || values.serieDate === undefined) {
      message.warning("Preencha os campos de série");
    } else {
      axios
        .post(`${API_URL}/series`, {
          name: values.serieName,
          date: values.serieDate.format("DD/MM/YYYY"),
        })
        .then(function (response) {
          getSeries();
          onReset();
          localStorage.setItem("lastUpdated", currentTime);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onFinishRecomendations = (values) => {
    if (values.recomendationName === undefined) {
      message.warning("Preencha os campos da recomendação");
    } else {
      axios
        .post(`${API_URL}/recomendations`, {
          name: values.recomendationName,
        })
        .then(function (response) {
          getRecomendation();
          onReset();
          localStorage.setItem("lastUpdated", currentTime);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onDelete = (item) => {
    axios
      .delete(`${API_URL}/movies/${item.id}`)
      .then(function (response) {
        getMovies();
        localStorage.setItem("lastUpdated", currentTime);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onDeleteSeries = (item) => {
    axios
      .delete(`${API_URL}/series/${item.id}`)
      .then(function (response) {
        getSeries();
        localStorage.setItem("lastUpdated", currentTime);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onDeleteRecomendation = (item) => {
    axios
      .delete(`${API_URL}/recomendations/${item.id}`)
      .then(function (response) {
        getRecomendation();
        localStorage.setItem("lastUpdated", currentTime);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onChange = (date, dateString) => {
    console.log(date.format("DD/MM/YYYY HH:mm:ss"));
    console.log(dateString);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const filteredMoviesList = data[0]?.filter((item) =>
    item?.name?.toLowerCase()?.includes(moviesInputValue)
  );

  const filteredSeriesList = dataSeries[0]?.filter((item) =>
    item?.name?.toLowerCase()?.includes(seriesInputValue)
  );

  return (
    <div className="container-all">
      <main className="main-container">
        <div className="movies">
          <Title>Movies</Title>

          <Form onFinish={onFinish} name="movies" form={form}>
            <div className="inputs">
              <Form.Item name="movieName">
                <Input placeholder="Escreva o nome do filme" />
              </Form.Item>
              <Form.Item name="movieDate">
                <DatePicker
                  onChange={onChange}
                  format="DD/MM/YYYY"
                  placeholder="Selecione a data"
                />
              </Form.Item>
              <Button icon={<PlusOutlined />} size="large" htmlType="submit" />
            </div>
          </Form>

          <Col className="list-container-col">
            <Input
              className="search-input"
              placeholder="Pesquise pelo nome do filme"
              onChange={(e) => setMoviesInputValue(e.target.value)}
            />
            <List
              itemLayout="horizontal"
              dataSource={filteredMoviesList}
              loading={loading}
              locale={{
                emptyText: (
                  <div className="no-data">
                    <h1>Sem filmes registrados</h1>
                  </div>
                ),
              }}
              renderItem={(item, index) => (
                <List.Item>
                  <Col span={24}>
                    <Row className="list-row">
                      <Col span={14}>
                        <p style={{ display: "inline", fontSize: "18px" }}>
                          {item.name}
                        </p>
                      </Col>
                      <Col span={6} style={{ fontSize: "18px" }}>
                        {item.date}
                      </Col>
                      <Col span={3}>
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => onDelete(item)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </List.Item>
              )}
            />
          </Col>
        </div>

        <div className="series">
          <Title>Series</Title>

          <Form onFinish={onFinishSeries} name="series" form={formSerie}>
            <div className="inputs">
              <Form.Item name="serieName">
                <Input placeholder="Escreva o nome da série" />
              </Form.Item>
              <Form.Item name="serieDate">
                <DatePicker
                  onChange={onChange}
                  format="DD/MM/YYYY"
                  placeholder="Selecione a data"
                />
              </Form.Item>
              <Button icon={<PlusOutlined />} size="large" htmlType="submit" />
            </div>
          </Form>

          <Col className="list-container-col">
            <Input
              className="search-input"
              placeholder="Pesquise pelo nome da serie"
              onChange={(e) => setSeriesInputValue(e.target.value)}
            />
            <List
              itemLayout="horizontal"
              dataSource={filteredSeriesList}
              loading={loadingSeries}
              locale={{
                emptyText: (
                  <div className="no-data">
                    <h1>Sem series registradas</h1>
                  </div>
                ),
              }}
              renderItem={(item, index) => (
                <List.Item>
                  <Col span={24}>
                    <Row className="list-row">
                      <Col span={14}>
                        <p style={{ display: "inline", fontSize: "18px" }}>
                          {item.name}
                        </p>
                      </Col>
                      <Col span={6} style={{ fontSize: "18px" }}>
                        {item.date}
                      </Col>
                      <Col span={3}>
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => onDeleteSeries(item)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </List.Item>
              )}
            />
          </Col>
        </div>
      </main>
      <footer className="footer-container">
        <Button onClick={showModal}>Recomendações</Button>
        <Modal
          title="Recomendações"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            onFinish={onFinishRecomendations}
            name="recomendations"
            form={formRecomendations}
          >
            <div className="inputs">
              <Form.Item name="recomendationName">
                <Input placeholder="Escreva o nome da recomendação" />
              </Form.Item>
              <Button icon={<PlusOutlined />} size="large" htmlType="submit" />
            </div>
          </Form>
          <Col className="list-container-col">
            <List
              itemLayout="vertical"
              dataSource={dataRecomendation.at(-1)}
              loading={loadingRecomendations}
              locale={{
                emptyText: (
                  <div className="no-data">
                    <h1>Sem recomendações registradas</h1>
                  </div>
                ),
              }}
              renderItem={(item, index) => (
                <List.Item>
                  <Col span={24}>
                    <Row className="list-row">
                      <Col span={14}>
                        <p style={{ display: "inline", fontSize: "18px" }}>
                          {item.name}
                        </p>
                      </Col>
                      <Col span={3}>
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => onDeleteRecomendation(item)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </List.Item>
              )}
            />
          </Col>
        </Modal>
        <p style={{ color: "white" }}>Last Updated: {time}</p>
        <p className="footer-line">Made by Pedro Freitas</p>
        <ul className="footer-link-container">
          <li className="footer-link">
            <a href="https://github.com/p-freitas">
              <img className="footer-icon" src={Github} alt="Logo Github" />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
