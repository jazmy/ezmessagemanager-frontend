import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Button, Container, Link, TextField, Typography, makeStyles } from "@material-ui/core";
import { toast } from "react-toastify";
import Page from "src/components/Page";

import { registerUser } from "../../services/authService";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		height: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3)
	}
}));

const RegisterView = () => {
	const classes = useStyles();
	const navigate = useNavigate();

	const _handleSubmit = async (values) => {
		try {
			const { email } = values;
			const { status } = await registerUser({ ...values, username: email });
			if (status === 200) {
				navigate("/app/employees", { replace: true });
			}
		} catch (ex) {
			toast.error(ex.response.data.data[0].messages[0].message);
		}
	};

	return (
		<Page className={classes.root} title="Register">
			<Box display="flex" flexDirection="column" height="100%" justifyContent="center">
				<Container maxWidth="sm">
					<Formik
						initialValues={{
							email: "",
							firstName: "",
							lastName: "",
							password: ""
						}}
						validationSchema={Yup.object().shape({
							email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
							firstName: Yup.string().max(255).required("First name is required"),
							lastName: Yup.string().max(255).required("Last name is required"),
							password: Yup.string().max(255).required("password is required")
						})}
						onSubmit={async (values, { setSubmitting }) => {
							const { firstName, lastName } = values;
							const finalValues = { ...values, fullname: firstName + lastName };
							delete finalValues.firstName;
							delete finalValues.lastName;
							await _handleSubmit(finalValues);
							await setSubmitting(false);
						}}
					>
						{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
							<form onSubmit={handleSubmit}>
								<Box mb={3}>
									<Typography color="textPrimary" variant="h2">
										Create new account
									</Typography>
									<Typography color="textSecondary" gutterBottom variant="body2">
										Use your email to create new account
									</Typography>
								</Box>
								<TextField
									error={Boolean(touched.firstName && errors.firstName)}
									fullWidth
									helperText={touched.firstName && errors.firstName}
									label="First name"
									margin="normal"
									name="firstName"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.firstName}
									variant="outlined"
								/>
								<TextField
									error={Boolean(touched.lastName && errors.lastName)}
									fullWidth
									helperText={touched.lastName && errors.lastName}
									label="Last name"
									margin="normal"
									name="lastName"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.lastName}
									variant="outlined"
								/>
								<TextField
									error={Boolean(touched.email && errors.email)}
									fullWidth
									helperText={touched.email && errors.email}
									label="Email Address"
									margin="normal"
									name="email"
									onBlur={handleBlur}
									onChange={handleChange}
									type="email"
									value={values.email}
									variant="outlined"
								/>
								<TextField
									error={Boolean(touched.password && errors.password)}
									fullWidth
									helperText={touched.password && errors.password}
									label="Password"
									margin="normal"
									name="password"
									onBlur={handleBlur}
									onChange={handleChange}
									type="password"
									value={values.password}
									variant="outlined"
								/>
								<Box my={2}>
									<Button
										color="primary"
										disabled={isSubmitting}
										fullWidth
										size="large"
										type="submit"
										variant="contained"
									>
										Sign up now
									</Button>
								</Box>
								<Typography color="textSecondary" variant="body1">
									Have an account?{" "}
									<Link component={RouterLink} to="/login" variant="h6">
										Sign in
									</Link>
								</Typography>
							</form>
						)}
					</Formik>
				</Container>
			</Box>
		</Page>
	);
};

export default RegisterView;
