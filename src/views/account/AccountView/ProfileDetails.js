import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, makeStyles } from "@material-ui/core";
import { updateUserAccountByNameAndPassword, updateUserAccountName, aboutMe } from "./accountService";
import { toast, Flip } from "react-toastify";
import { Link as RouterLink, useNavigate } from "react-router-dom";
const useStyles = makeStyles(() => ({
	root: {}
}));
import { logout } from "src/services/authService";
const ProfileDetails = ({ className, ...rest }) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [ userId, setUserId ] = useState("");
	const [ fullname, setFullName ] = useState("username");
	const [ email, setEmail ] = useState("email");
	const [ password, setPassword ] = useState("");

	useEffect(() => {
		if (localStorage.getItem("user")) {
			userProfile();
		}
	}, []);

	const userProfile = async () => {
		try {
			let response = await aboutMe();
			setUserId(response.data.id);
			setFullName(response.data.fullname);
			setEmail(response.data.email);
		} catch (error) {
			console.log(error);
		}
	};

	const updateUser = async (e) => {
		e.preventDefault();
		try {
			let id = userId;
			if (!Boolean(password)) {
				let response = await updateUserAccountName(id, fullname);
				if (response.status === 200) {
					responseSuccess();
				}
				return;
			} else {
				let response = await updateUserAccountByNameAndPassword(id, fullname, password);
				if (response.status === 200) {
					responseSuccess();
				}
				return;
			}
		} catch (error) {
			toast.error(`Sorry, but an error occured! Please try again later. `, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				transition: Flip
			});
		}
	};

	const responseSuccess = () => {
		toast.success(`Account Updated Successfully!`, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			transition: Flip
		});
		// handleLogout();
		location.reload();
	};

	const handleLogout = () => {
		logout();
		navigate("/login", { replace: true });
	};
	return (
		<form autoComplete="off" noValidate className={clsx(classes.root, className)} {...rest}>
			<Card>
				<CardHeader subheader="The information can be edited" title="Profile" />
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								helperText="Please specify the full name"
								label="Full name"
								name="fullName"
								onChange={(e) => setFullName(e.currentTarget.value)}
								required
								value={fullname}
								variant="outlined"
							/>
						</Grid>

						<Grid item md={6} xs={12}>
							<TextField
								disabled
								fullWidth
								label="Email Address"
								name="email"
								required
								value={email}
								variant="outlined"
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								helperText="Password"
								label="Password"
								name="password"
								type="password"
								onChange={(e) => setPassword(e.currentTarget.value)}
								required
								value={password}
								variant="outlined"
							/>
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<Box display="flex" justifyContent="flex-end" p={2}>
					<Button onClick={updateUser} color="primary" variant="contained">
						Save details
					</Button>
				</Box>
			</Card>
		</form>
	);
};

ProfileDetails.propTypes = {
	className: PropTypes.string
};

export default ProfileDetails;
