import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import RecoverPassword from './Pages/Auth/RecoverPassword';
import Register from './Pages/Auth/Register';
import SignIn from './Pages/Auth/SignIn';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import PageItems from './Pages/PageItems';
import PageList from './Pages/PageList';
import PageLists from './Pages/PageLists';

const Router: React.FC = () => {
  const { isLoggedIn, emailVerified } = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <div
        className={`${
          emailVerified ? 'mt-16 mb-20' : 'mt-20 mb-24'
        } sm:max-w-[100vw] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1200px] mx-auto flex flex-col`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/sign-in"
            element={isLoggedIn ? <Navigate to="/" /> : <SignIn />}
          />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items" element={<PageItems />} />
          <Route path="/lists" element={<PageLists />} />
          <Route path="/lists/new" element={<PageList />} />
          <Route path="/lists/:listId" element={<PageList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
