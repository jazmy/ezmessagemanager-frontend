import "react-perfect-scrollbar/dist/css/styles.css";
import React from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "src/components/GlobalStyles";
import theme from "src/theme";
import routes from "src/routes";
//appolo client
import ApolloClient from "apollo-boost";
//appolo provider
import { ApolloProvider } from "react-apollo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
let SERVER_URL = process.env.REACT_APP_SERVER_URL;
// const client = new ApolloClient({ uri: `${SERVER_URL}graphql` });

const client = new ApolloClient({
	uri: `${SERVER_URL}graphql`,
	headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` },
	onError: ({ networkError, graphQLErrors }) => {}
});

const App = () => {
	const routing = useRoutes(routes);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<ToastContainer />
				<GlobalStyles />
				{routing}
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default App;
