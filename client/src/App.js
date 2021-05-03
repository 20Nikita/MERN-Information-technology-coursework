import {Rout} from './html';
import {BrowserRouter} from "react-router-dom"

function App() {
  const html = Rout()
  return (
    <BrowserRouter>
        {html}
    </BrowserRouter>
  )
}

export default App;
