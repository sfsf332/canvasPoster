"use client";
import { Oswald } from "next/font/google";
import { Inter } from "next/font/google";

import html2canvas from "html2canvas";
import { useCallback, useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Space,
  message,
  Upload,
  DatePicker,
  Row,
  Col,
} from "antd";
import { Box } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
const oswald = Oswald({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
type PosterMeta = {
  title: string;
  subTitle: string;
  organizer: Orgs;
  // coOrganizer: Orgs[];
  // media: Orgs[];
  // supporter: UserInfo[];
  speaker: UserInfo[];
  time: Date;
  // address: string;
  zoomId: string;
  twitterSpaceId: string;
};
type Orgs = {
  logo: string;
  name: string;
};
type UserInfo = {
  head: string;
  name: string;
  info: string;
  // twitter: string;
};
const props: UploadProps = {
  name: "file",
  action: "https://beta.seedao.cc/api/cover",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
interface Window {
  Image: {
    prototype: HTMLImageElement;
    new (): HTMLImageElement;
  };
}
let defPoster = {
  title: "活动主标题",
  subTitle: "活动副标题活动副标题活动副标题活动副标题",
  twitterSpaceId: "1BRKjZQgLRwKw",
  zoomId: "85063791080",
  organizer: {
    name: "SeeDao",
    logo: "/logo_seedao.png",
  },

  // coOrganizer: [
  //   {
  //     name: "NFTScan",
  //     logo: "https://seedao.xyz/images/logo-dark.png",
  //   },
  // ],
  // media: [
  //   {
  //     name: "Ensoul",
  //     logo: "https://seedao.xyz/images/portfolio/ensoul.png",
  //   },
  //   {
  //     name: "PfpDAO",
  //     logo: "https://seedao.xyz/images/portfolio/pfpdao.jpeg",
  //   },
  // ],
  supporter: [
    {
      head: "https://beta.seedao.cc/assets/see_dao_logo_white-f56e82b3.png",
      name: "Suannai",
      info: "随便简介",
      twitter: "@seedao_talk",
    },
  ],
  speaker: [
    {
      head: "https://eips.fun/_next/image?url=%2Fimages%2Fvictorzhou.jpg&w=384&q=75",
      name: "Suannai",
      info: "随便简介",
      twitter: "@seedao_talk",
    },
    {
      head: "https://eips.fun/_next/image?url=%2Fimages%2Fvictorzhou.jpg&w=384&q=75",
      name: "Suannai",
      info: "随便简介",
      twitter: "@seedao_talk",
    },
  ],
};
export default function Home() {
  const [poster, setPoster] = useState<any>(defPoster);

  const saveImage = useCallback(() => {
    if (process.browser) {
      let ground = document.getElementById("ground");
      if (ground) {
        const html_2_canvas_option = {
          useCORS: true,
          scale: 2,
          width: ground.scrollWidth,
          height: ground.scrollHeight,
          windowWidth: ground.scrollWidth,
          windowHeight: ground.scrollHeight,
          dpi: 300,
          x: 0,
          y: 0,
        };
        html2canvas(ground, html_2_canvas_option).then((canvasEl) => {
          const imageBase64 = canvasEl.toDataURL("image/png"); // 得到base64
          // 下载到本地
          const { firstChild: canvas }: any = imageBase64;
          const img = new window.Image();
          img.src = canvasEl.toDataURL("image/png");
          img.onload = () => {
            const link = document.createElement("a");
            link.href = img.src;
            link.download = `poster.png`;
            const event = new MouseEvent("click"); // 创建一个单击事件
            link.dispatchEvent(event); // 主动触发a标签的click事件下载
          };
        });
      }
    }
  }, []);
  const onFinish = (values: any) => {
    setPoster(values);
    console.log("Received values of form:", values);
  };
  return (
    <Box sx={{ maxWidth: "100%", padding: "0!important" }}>
      <Box justifyContent="center" margin="0 auto" width={"100%"}>
        <Box width={1200}>
          <Form
            name="poster"
            onFinish={onFinish}
            style={{ maxWidth: 1200 }}
            initialValues={defPoster}
            autoComplete="off"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item
              label="主标题"
              name="title"
              rules={[{ required: true, message: "请输入主标题!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="副标题" name="subTitle">
              <Input />
            </Form.Item>

            <Form.Item
              label="时间"
              name="time"
              rules={[{ required: true, message: "请选择活动时间" }]}
            >
              <DatePicker showTime />
            </Form.Item>
            <Form.Item
              label="ZoomId"
              name="zoomId"
              rules={[{ required: true, message: "请输入ZoomID" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="SpaceId"
              name="twitterSpaceId"
              rules={[{ required: true, message: "请输入twitterSpaceId" }]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item label="地点" name="address">
              <Input />
            </Form.Item> */}
            <Form.Item label="主办方" name={["organizer", "name"]}>
              <Input />
            </Form.Item>
            <Form.Item label="主办方Logo" name={["organizer", "logo"]}>
              <Input />
            </Form.Item>

            {/*  */}
            <Form.Item label="主持人">
              <Form.List name="supporter">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          label="名称"
                          name={[name, "name"]}
                          rules={[
                            { required: true, message: "缺失主持人名称" },
                          ]}
                        >
                          <Input placeholder="主持人名称" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="头像"
                          name={[name, "head"]}
                          rules={[
                            { required: true, message: "缺失主持人头像" },
                          ]}
                        >
                          <Input placeholder="主持人头像" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          label="简介"
                          name={[name, "info"]}
                          rules={[
                            { required: true, message: "缺失主持人简介" },
                          ]}
                        >
                          <Input placeholder="主持人简介" />
                        </Form.Item>
                        {/* <Form.Item
                          {...restField}
                          label="twitter"
                          name={[name, "twitter"]}
                          rules={[
                            { required: true, message: "缺失主持人twitter" },
                          ]}
                        >
                          <Input placeholder="主持人twitter" />
                        </Form.Item> */}
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        添加主持人
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label="嘉宾">
              <Form.List name="speaker">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          label="名称"
                          name={[name, "name"]}
                          rules={[{ required: true, message: "缺失嘉宾名称" }]}
                        >
                          <Input placeholder="嘉宾名称" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="头像"
                          name={[name, "head"]}
                          rules={[
                            { required: true, message: "缺失主持人头像" },
                          ]}
                        >
                          <Input placeholder="嘉宾头像" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="简介"
                          name={[name, "info"]}
                          rules={[
                            { required: true, message: "缺失主持人简介" },
                          ]}
                        >
                          <Input placeholder="主持人简介" />
                        </Form.Item>
                        {/* <Form.Item
                          {...restField}
                          label="twitter"
                          name={[name, "twitter"]}
                          rules={[
                            { required: true, message: "缺失主持人twitter" },
                          ]}
                        >
                          <Input placeholder="主持人twitter" />
                        </Form.Item> */}
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        添加嘉宾
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  style={{
                    margin: "0 20px",
                  }}
                >
                  Submit
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    saveImage();
                  }}
                  style={{
                    margin: "0 20px",
                  }}
                >
                  save
                </Button>
              </Col>
            </Row>
            <Form.Item></Form.Item>
          </Form>
        </Box>
        <Box width={"100%"}>
          <div
            id="ground"
            style={{
              background: "url('/bg.png') top center  no-repeat ",
            }}
          >
            <div className="header ">
              <div className="logo">
                <img src={poster.organizer.logo} width={265} />
              </div>
              <div className="space">
                <div className="space_item">
                  <div className={oswald.className + " title"}>
                    <img src="/icon_zoom.png" className="space_logo" />
                    <span>
                      {poster.zoomId.substring(0, 3)}
                      {"-"}
                      {poster.zoomId.substring(3, 6)}
                      {"-"}
                      {poster.zoomId.substring(6, 9)}
                    </span>
                  </div>
                  <div className="qr">
                    <QRCodeSVG
                      value={"https://us06web.zoom.us/j/" + poster.zoomId}
                      size={90}
                    />
                  </div>
                </div>
                <div className="space_item">
                  <div className={oswald.className + " title"}>
                    <img src="/icon_twitter.png" className="space_logo" />
                    <span>{poster.twitterSpaceId}</span>
                  </div>
                  <div
                    className="qr"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <QRCodeSVG
                      value={
                        "https://twitter.com/i/spaces/" + poster.twitterSpaceId
                      }
                      size={90}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <h1 className={inter.className}>{poster.title}</h1>
              <h2 className={inter.className}>{poster.subTitle}</h2>
              <h3 className={oswald.className}>{poster.time?.toString()}</h3>

              {/* <h3 style={{ textAlign: "right" }}>{poster.address}</h3> */}

              <div className="poster_speaker" style={{ display: "flex" }}>
                <div className="speaker_List">
                  <label className={oswald.className}>HOST</label>
                  <div className="speaker_item">
                    {poster.supporter &&
                      poster.supporter.length > 0 &&
                      poster.supporter.map((item: any, index: number) => {
                        return (
                          <div key={index} className="speaker_box">
                            <img src={item.head} width={140} height={140} />

                            <h3 className={oswald.className}>
                              {item.name}
                              {/* <span>{item.info}</span> */}
                            </h3>
                            <p className={oswald.className}>{item.info}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="speaker_List">
                  <label className={oswald.className}>GUEST</label>
                  <div className="speaker_item">
                    {poster.speaker.length > 0 &&
                      poster.speaker.map((item: any, index: number) => {
                        return (
                          <div key={index} className="speaker_box">
                            <img src={item.head} width={140} height={140} />

                            <h3 className={oswald.className}>
                              {item.name}
                              {/* <span>{item.info}</span> */}
                            </h3>
                            <p className={oswald.className}>{item.info}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
