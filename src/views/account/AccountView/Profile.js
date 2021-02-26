import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
let SERVER_URL = process.env.REACT_APP_SERVER_URL;
let avatar_url = process.env.REACT_APP_AVATAR_URL;
//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";
import { toast, Flip } from "react-toastify";
import { updateAvatar, aboutMe } from "./accountService";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
	Typography,
	makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
	root: {},
	avatar: {
		height: 100,
		width: 100
	}
}));

const Profile = ({ className, ...rest }) => {
	const classes = useStyles();
	const [ file, setFile ] = useState(null);
	const [ userId, setUserId ] = useState("");
	const [ userName, setUserName ] = useState("");
	const [ avatartoDisplay, setAvatarToDisplay ] = useState("");
	const handleChange = (event) => {
		event.preventDefault();
		setFile(event.target.files[0]);
	};
	useEffect(() => {
		if (localStorage.getItem("user")) {
			userProfile();
			setUserId(JSON.parse(localStorage.getItem("user")).id);
		}
	}, []);

	const userProfile = async () => {
		try {
			let response = await aboutMe();
			console.log(response.data);
			setUserName(response.data.fullname);
			let av = response.data.avatar;
			let user_avatar = avatar_url + av;
			setAvatarToDisplay(user_avatar);
		} catch (error) {
			console.log(error);
		}
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append("files", file);
		axios
			.post(`${SERVER_URL}upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("x-auth-token")}`
				}
			})
			.then((res) => {
				// console.log(res);
				let avatar = res.data[0].formats.thumbnail.url;
				updateAvatar(userId, avatar).then((res) => {
					if (res.status === 200) {
						toast.success(`Account Avatar Updated Successfully!`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						location.reload();
					}
				});
				setFile("");
			})
			.catch((err) => {
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
			});
	};
	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<CardContent>
				<Box alignItems="center" display="flex" flexDirection="column">
					<Avatar className={classes.avatar} src={avatartoDisplay} />
					<Typography color="textPrimary" gutterBottom variant="h3">
						{userName}
					</Typography>
				</Box>
			</CardContent>
			<Divider />
			<CardActions>
				<form onSubmit={handleSubmit}>
					<input onChange={handleChange} style={{ paddingLeft: 45 }} color="primary" type="file" />
					<Button type="submit" color="primary" fullWidth variant="text">
						Upload
					</Button>
				</form>
			</CardActions>
		</Card>
	);
};

Profile.propTypes = {
	className: PropTypes.string
};

export default Profile;
