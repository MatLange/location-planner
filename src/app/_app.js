import React from "react"
import { wrapper, makeStore } from "./store"
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
    return (
      <>
        <Provider store={makeStore}>
          <Component {...pageProps} />
        </Provider>
      </>
    );
  }
  
  export default wrapper.withRedux(MyApp);