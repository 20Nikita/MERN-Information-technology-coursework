import "materialize-css"

import {Rout} from './html';
import {BrowserRouter} from "react-router-dom"



function App() {
  const html = Rout()
  return (
    <BrowserRouter>
      <div className="container">
        {html}
      </div>
    </BrowserRouter>
  )
}

export default App;
