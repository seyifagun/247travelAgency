// import { Form as FormAnt, Input, Button, Layout, Menu } from "antd";
// import Link from "next/link";
// import Image from "next/image";
// import Head from "next/head";
// import { EditOutlined } from "@ant-design/icons";
// import DeveloperNavbar from "../components/developerNavbarr";

// import usernameIcon from "../public/icons/username.webp";
// import travellerIcon from "../public/icons/traveller.webp";
// import creditcardIcon from "../public/icons/credit-card.webp";
// import flightIcon from "../public/icons/flight-booking.webp";

// const { Header, Content, Sider } = Layout;

// const EditProfile = () => {
//   return (
//     <>
//       <Head>
//         <title>247Travels | Edit Profile</title>
//       </Head>
//       <div className="container developernavbar-classname">
//         <DeveloperNavbar />
//       </div>
//       <Layout>
//         <Sider
//           breakpoint="lg"
//           collapsedWidth="0"
//           onBreakpoint={(broken) => {
//             console.log(broken);
//           }}
//           onCollapse={(collapsed, type) => {
//             console.log(collapsed, type);
//           }}
//         >
//           <div className="logo">
//             <h5 className="sidebar-header">My Account</h5>
//           </div>
//           <Menu theme="" mode="inline" defaultSelectedKeys={["1"]}>
//             <Menu.Item key="1">
//               <Image src={usernameIcon} alt={"username icon"} />
//               <Link href="/affiliate-program" passHref>
//                 <h5>Profile</h5>
//               </Link>
//             </Menu.Item>
//             <Menu.Item key="2">
//               <Image src={travellerIcon} alt={"travellers icon"} />
//               <Link href="/flight-reg/travelers" passHref>
//                 <h5>Travellers</h5>
//               </Link>
//             </Menu.Item>
//             <Menu.Item key="3">
//               <Image src={flightIcon} alt={"flight icon"} />
//               <Link href="/flight-reg/flight-book" passHref>
//                 <h5> Flight Bookings </h5>
//               </Link>
//             </Menu.Item>
//             <Menu.Item key="4">
//               <Image src={creditcardIcon} alt={"credit card icon"} />
//               <Link href="/flight-reg/credit-card" passHref>
//                 <h5> Credit Card </h5>
//               </Link>
//             </Menu.Item>
//           </Menu>
//         </Sider>
//         <Layout>
//           <Header
//             className="site-layout-sub-header-background"
//             style={{ padding: 0 }}
//           />
//           <Content className="container" style={{ margin: "10px 50px 0" }}>
//             <div
//               className="site-layout-background"
//               style={{ padding: 24, minHeight: 360 }}
//             >
//               <div className="row mt-5 mb-5">
//                 <div className="col-md-4 card m-auto shadow-lg">
//                   <div className="card-body custom-made p-5">
//                     <div className="p-4">
//                       <div className="edit-profile-form">
//                         <span
//                           style={{
//                             color: "#0043a4",
//                             fontWeight: "700",
//                             fontSize: "20px",
//                           }}
//                         >
//                           <EditOutlined /> &nbsp;
//                         </span>
//                         <span
//                           style={{
//                             color: "#0043a4",
//                             fontWeight: "700",
//                             fontSize: "20px",
//                           }}
//                         >
//                           {" "}
//                           Edit Profile
//                         </span>
//                       </div>
//                     </div>
//                     <FormAnt>
//                       <div className="form-group input-field p-4">
//                         <label
//                           htmlFor="Sign Up"
//                           style={{ color: "#0043a4" }}
//                           className="pb-2"
//                         >
//                           Company Name
//                         </label>
//                         <FormAnt.Item
//                           name="username"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Please input your username!",
//                             },
//                           ]}
//                         >
//                           <Input
//                             name="username"
//                             className="form-control affiliate-input custom-input"
//                             placeholder="Input New Company Name"
//                           />
//                         </FormAnt.Item>
//                       </div>
//                       <div className="form-group input-field p-4">
//                         <label
//                           htmlFor="Sign Up"
//                           style={{ color: "#0043a4" }}
//                           className="pb-2"
//                         >
//                           Email Address
//                         </label>
//                         <FormAnt.Item
//                           name="username"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Please input your username!",
//                             },
//                           ]}
//                         >
//                           <Input
//                             name="username"
//                             className="form-control affiliate-input custom-input"
//                             placeholder="Input New Email Address"
//                           />
//                         </FormAnt.Item>
//                       </div>
//                       <div className="form-group input-field p-4">
//                         <label
//                           htmlFor="Sign Up"
//                           style={{ color: "#0043a4" }}
//                           className="pb-2"
//                         >
//                           Phone Number
//                         </label>
//                         <FormAnt.Item
//                           name="username"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Please input your username!",
//                             },
//                           ]}
//                         >
//                           <Input
//                             name="username"
//                             className="form-control affiliate-input custom-input"
//                             placeholder="Input New Phone Number"
//                           />
//                         </FormAnt.Item>
//                       </div>
//                       <div className="form-group input-field p-4">
//                         <label
//                           htmlFor="Sign Up"
//                           style={{ color: "#0043a4" }}
//                           className="pb-2"
//                         >
//                           Password
//                         </label>
//                         <FormAnt.Item
//                           name="password"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Please input your password!",
//                             },
//                           ]}
//                         >
//                           <Input.Password
//                             name="password"
//                             className="form-control affiliate-input custom-input"
//                             placeholder="Input New Password"
//                           />
//                         </FormAnt.Item>
//                       </div>
//                       <div
//                         className="form-group pt-4"
//                         style={{ textAlign: "center" }}
//                       >
//                         <FormAnt.Item>
//                           <Button
//                             type="primary"
//                             htmlType="submit"
//                             className="btn btn-primary affiliate-login-btn"
//                             style={{ backgroundColor: "#0043a4" }}
//                           >
//                             Submit
//                           </Button>
//                         </FormAnt.Item>
//                       </div>
//                     </FormAnt>
//                     {/* <div style={{ textAlign: "center" }} className="p-4">
//               <small style={{ color: "#0043a4", fontWeight: "600" }}>
//                 By logging in you accept our{" "}
//                 <span style={{ color: "orange", fontWeight: "600" }}>
//                   terms of use
//                 </span>{" "}
//                 and <span style={{ color: "orange" }}>privacy policy.</span>
//               </small>
//             </div> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Content>
//         </Layout>
//       </Layout>
//       {/* ********************* */}

      
//     </>
//   );
// };

// export default EditProfile;
