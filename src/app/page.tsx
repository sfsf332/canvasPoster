"use client";

import Image from "next/image";
import html2canvas from "html2canvas";
import { useCallback, useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Space,
  Layout,
  message,
  Upload,
  DatePicker,
} from "antd";
import { Box } from "@mui/material";

import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
type PosterMeta = {
  title: string;
  subTitle: string;
  organizer: Orgs;
  coOrganizer: Orgs[];
  media: Orgs[];
  supporter: UserInfo[];
  speaker: UserInfo[];
  time: Date;
  address: string;
};
type Orgs = {
  logo: string;
  name: string;
};
type UserInfo = {
  head: string;
  name: string;
  info: string;
  twitter: string;
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
  title: "SeeDao",
  subTitle: "SeeDao活动",
  organizer: {
    name: "SeeDao",
    logo: "https://beta.seedao.cc/assets/see_dao_logo_white-f56e82b3.png",
  },
  coOrganizer: [
    {
      name: "NFTScan",
      logo: "https://seedao.xyz/images/logo-dark.png",
    },
  ],
  media: [
    {
      name: "Ensoul",
      logo: "https://seedao.xyz/images/portfolio/ensoul.png",
    },
    {
      name: "PfpDAO",
      logo: "https://seedao.xyz/images/portfolio/pfpdao.jpeg",
    },
  ],
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
  // useEffect(() => {
  //   let ground = document.getElementById("ground");
  //   if (ground) {
  //     html2canvas(ground, html_2_canvas_option).then(function (canvas) {
  //       document.querySelector("#canvas")?.appendChild(canvas);
  //     });
  //   }
  // }, []);
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
      <Box
        display="flex"
        justifyContent="center"
        margin="0 auto"
        width={"100%"}
      >
        <Box width={800}>
          <Form
            name="poster"
            onFinish={onFinish}
            style={{ maxWidth: 800 }}
            initialValues={defPoster}
            autoComplete="off"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input your title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Sub Title" name="subTitle">
              <Input />
            </Form.Item>
            <Form.Item
              label="时间"
              name="time"
              rules={[{ required: true, message: "Please input your time!" }]}
            >
              <DatePicker showTime />
            </Form.Item>
            <Form.Item label="地点" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="主办方" name={["organizer", "name"]}>
              <Input />
            </Form.Item>
            <Form.Item label="主办方Logo" name={["organizer", "logo"]}>
              <Input />
            </Form.Item>
            <Form.Item label="协办方">
              <Form.List name="coOrganizer">
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
                            { required: true, message: "缺失协办方名称" },
                          ]}
                        >
                          <Input placeholder="协办方名称" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="logo"
                          name={[name, "logo"]}
                          rules={[
                            { required: true, message: "缺失协办方logo" },
                          ]}
                        >
                          {/* <Upload {...props}>
                            <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button>
                          </Upload> */}
                          <Input />
                        </Form.Item>
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
                        添加协办方
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label="媒体">
              <Form.List name="media">
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
                          rules={[{ required: true, message: "缺失媒体名称" }]}
                        >
                          <Input placeholder="媒体名称" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="logo"
                          name={[name, "logo"]}
                          rules={[{ required: true, message: "缺失媒体logo" }]}
                        >
                          {/* <Upload {...props}>
                            <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button>
                          </Upload> */}
                          <Input />
                        </Form.Item>
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
                        添加媒体
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
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
                        <Form.Item
                          {...restField}
                          label="twitter"
                          name={[name, "twitter"]}
                          rules={[
                            { required: true, message: "缺失主持人twitter" },
                          ]}
                        >
                          <Input placeholder="主持人twitter" />
                        </Form.Item>
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
                        <Form.Item
                          {...restField}
                          label="twitter"
                          name={[name, "twitter"]}
                          rules={[
                            { required: true, message: "缺失主持人twitter" },
                          ]}
                        >
                          <Input placeholder="主持人twitter" />
                        </Form.Item>
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
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  saveImage();
                }}
              >
                save
              </Button>
            </Form.Item>
          </Form>
        </Box>
        <Box flex={1}>
          <div
            id="ground"
            style={{
              background: "url('/temp1.jpg') top center  no-repeat ",
            }}
          >
            <div className="poster_organizer">
              <img src={poster.organizer.logo} />
              {/* <span>{poster.organizer.name}</span> */}
            </div>
            <h1 style={{ textAlign: "right" }}>{poster.title}</h1>
            <h2 style={{ textAlign: "right" }}>{poster.subTitle}</h2>
            <h3 style={{ textAlign: "right" }}>{poster.time?.toString()}</h3>
            <h3 style={{ textAlign: "right" }}>{poster.address}</h3>

            <div className="poster_speaker" style={{ display: "flex" }}>
              嘉宾:
              {poster.speaker.length > 0 &&
                poster.speaker.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <img src={item.head} width={100} height={100} />
                      <div>
                        <h3 className="speaker">
                          {item.name}
                          <span>{item.info}</span>
                        </h3>
                        <p>{item.twitter}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="poster_speaker" style={{ display: "flex" }}>
              协办方:
              {poster.coOrganizer.length > 0 &&
                poster.coOrganizer.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <img src={item.logo} /> {item.name}
                     
                    </div>
                  );
                })}
            </div>
            <div className="poster_speaker" style={{ display: "flex" }}>
              合作媒体:
              {poster.coOrganizer.length > 0 &&
                poster.media.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <img src={item.logo}  />
                      <div>
                        <h3 className="speaker">
                          {item.name}
                          <span>{item.info}</span>
                        </h3>
                        <p>{item.twitter}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
