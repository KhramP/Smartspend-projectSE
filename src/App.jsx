import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  const page = window.location.pathname;

  if(page === "/register"){
    return <Register/>
  }

  return <Login/>
}

export default App;

