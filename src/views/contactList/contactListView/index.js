import React from "react";
import { Box, Container, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";
//we imported Resultes that we developed to render
import Results from "./Results";

//makeStyles is hook in '@material-ui/core', that is an initilizer to give styling
const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3)
	}
}));

const ContactListView = () => {
	//we initilized classes vaiable here.
	const classes = useStyles();

	return (
		<Page className={classes.root} title="Contact-List">
			<Container maxWidth={false}>
				{/* so here you can see the fruit of our job */}
				<Box mt={3}>
					<Results />
				</Box>
			</Container>
		</Page>
	);
};

//we exports this in use in routes.
export default ContactListView;
