import React, { useState } from "react";
import { Input } from 'antd';
import Image from 'next/image'
import Link from 'next/link';
import { EditOutlined , EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from "../styles/userProfile.module.css";

import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import DeveloperNavbar from "../components/developerNavbarr";


// IMPORT FUNCTIONS TO GET AND UPLOAD PICTURES

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
const UserProfile = () => {

// CREATE PROP FOR CONTACT DETAILS EDIT

  const GeneralInfo = ({ name, title }) => (
    <>
      <div className="mb-5">
        <h3 className={styles.infoTitle}>{title}</h3>
        <div className={styles.infoContainer}>
          <p className={styles.infoParagraph}>{name}</p>
          <EditOutlined />
        </div>
      </div>
    </>
  );

  const [ uploadLoading, setUploadLoading] = useState(false);

  uploadLoading = { loading:false };


  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        setUploadLoading({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  const { loading, imageUrl } = uploadLoading;
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  
  return (
    <>
      <div
        className="container"
        style={{ background: "rgba(0, 149, 255, 0.1)" }}
      >
        <DeveloperNavbar />
        <div className="p-5">
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <h3 className="mb-3 mt-3" style={{ color: "#0043a4"}}>My Profile</h3>
              <div style={{ background: "#0043a4" }} className="mb-3">
                <div
                  style={{
                    background: "#0043a4",
                    padding: "1rem 0 1rem 3rem",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ color: "#fff", width: "50%" }}>
                    Welcome{" "}
                    <span style={{ color: "orange" }}>Travel4less Limited</span>
                    <span> Below are your profile details as an admin</span>
                  </p>
                </div>
              </div>
              <h3 className="mt-3 mb-3" style={{ color: "#0043a4"}}>General Information</h3>
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <GeneralInfo title="Name" name="Bukola Bakare" />
                  <GeneralInfo title="Email" name="bukola.bakare@travel4less.com" />
                  <GeneralInfo title="Gender" name="Female" />
                </div>
                <div className="col-sm-12 col-md-6">
                  <GeneralInfo
                    title="Company Name"
                    name="Travel4less Limited."
                  />
                  <GeneralInfo title="Location" name="Lagos" />
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4">
                <div style={{ textAlign:"center"}} className="mt-3">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"   
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? <Image src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </div>
            </div>

          </div>
          {/* CHANGE PASSWORD SECTION */}
          <div>
            <h3 className="mb-3" style={{ color: "#0043a4"}}>Change Password</h3>
            <div className="row">
                    <div className="col-sm-12 col-md-4" >
                        <Input.Password placeholder="input password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                    </div>
                    <div className="col-sm-12 col-md-4" >
                        <Input.Password placeholder="input password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                    </div>
                    <div className="col-sm-12 col-md-4" >
                        <Link href="/B2bIndex" as='/B2B-Index' passHref><a><input
                            type="Submit"
                            className="btn btn-primary"
                            style={{ backgroundColor: "#0043a4" }}
                        /></a></Link>
                    </div>
               
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;


 

  
   


  