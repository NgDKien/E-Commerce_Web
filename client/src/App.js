import React, { useEffect, useState, useRef } from 'react';
import { Route, Routes } from 'react-router-dom'
import {
  Login,
  Home,
  Public,
  FAQ,
  DetailProduct,
  Services,
  DetailBlogs,
  Products,
  FinalRegister,
  ResetPassword,
  DetailCart
} from './pages/public'
import {
  AdminLayout,
  ManageOrder,
  ManageProducts,
  ManageUser,
  CreateProducts,
  Dashboard,
  CreateBlog,
  ManageBlog,
} from "pages/admin"
import {
  MemberLayout,
  Personal,
  History,
  Wishlist,
  Checkout,
} from "pages/member"
import path from './ultils/path'
import { getCategories } from './store/app/asyncActions'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Modal, Cart, ChatbotIcon, ChatForm, ChatMessage } from './components';
import { showCart } from 'store/app/appSlice';

import { companyInfo } from 'companyInfo';
import Blog from 'pages/public/Blog';

function App() {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo
    }
  ]);
  const [showChatbot, setShowChatBot] = useState(false);
  const chatBodyRef = useRef();
  const generateBotResponse = async (history) => {
    //Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "Thinking..."), { role: "model", text, isError }]);
    }

    //Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history })
    }

    try {
      //Make the API call to get the bot's response
      const response = await fetch(process.env.REACT_APP_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong!");

      //Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);

      console.log(data);
    } catch (error) {
      updateHistory(error.message, true);
    }
  }
  useEffect(() => {
    //Auto scroll
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory])

  const dispatch = useDispatch()
  const { isShowModal, modalChildren, isShowCart } = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories())
  }, [])
  return (
    <div className="font-jp">
      {isShowCart && (
        <div
          onClick={() => dispatch(showCart())}
          className="absolute inset-0 bg-overlay z-50 flex justify-end"
        >
          <Cart />
        </div>
      )}
      {isShowModal && <Modal>{modalChildren}</Modal>}

      {/* Chatbot */}
      <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
        <button onClick={() => setShowChatBot(prev => !prev)} id="chatbot-toggler">
          <span className='material-symbols-rounded'>mode_comment</span>
          <span className='material-symbols-rounded'>close</span>
        </button>
        <div className='chatbot-popup'>
          {/* Chatbot Header */}
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">Chatbot</h2>
            </div>
            <button onClick={() => setShowChatBot(prev => !prev)} className='material-symbols-rounded'>keyboard_arrow_up</button>
          </div>
          {/* Chatbot Body */}
          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">
                Hey there 🔥<br />
                How can I help you today?
              </p>
            </div>
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>
          {/* Chatbot Footer */}
          <div className='chat-footer'>
            <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
          </div>
        </div>
      </div>

      <Routes>
        <Route path={path.CHECKOUT} element={<Checkout />} />
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS__ID__TITLE} element={<DetailBlogs />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          {/* <Route path={path.DETAIL_CART} element={<DetailCart />} /> */}
          <Route path={path.ALL} element={<Home />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />} />
          <Route path={path.CREATE_BLOG} element={<CreateBlog />} />
          <Route path={path.MANAGE_BLOGS} element={<ManageBlog />} />
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.MY_CART} element={<DetailCart />} />
          <Route path={path.WISHLIST} element={<Wishlist />} />
          <Route path={path.HISTORY} element={<History />} />
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
