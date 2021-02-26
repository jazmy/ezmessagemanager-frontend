/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Avatar, Box, Divider, Drawer, Hidden, List, Typography, makeStyles } from "@material-ui/core";
import EmailIcon from "@material-ui/icons/Email";
import LinkIcon from "@material-ui/icons/Link";
import CodeIcon from "@material-ui/icons/Code";
import { Users as UsersIcon, Settings as SettingsIcon, Watch as WatchICon } from "react-feather";
import NavItem from "./NavItem";
import { aboutMe } from "./aboutmeService";
let avatar_url = process.env.REACT_APP_AVATAR_URL;

//here are we developing left side bar
const items = [
	{
		href: "/app/employees",
		icon: UsersIcon,
		title: "Employees"
	},
	{
		href: "/app/mail-logs",
		icon: EmailIcon,
		title: "Mail Logs"
	},
	{
		href: "/app/templates",
		icon: CodeIcon,
		title: "Templates"
	},

	{
		href: "/app/contact-list",
		icon: UsersIcon,
		title: "Contact Lists"
	},
	{
		href: "/app/tags",
		icon: LinkIcon,
		title: "Tags"
	},
	{
		href: "/app/employee-metadata",
		icon: LinkIcon,
		title: "Employee MetaData"
	},
	{
		href: "/app/email-schedules",
		icon: WatchICon,
		title: "Email Schedules"
	},
	{
		href: "/app/slack-schedules",
		icon: WatchICon,
		title: "Slack Schedules"
	},
	{
		href: "/app/account",
		icon: SettingsIcon,
		title: "Account Setting"
	}
];

const useStyles = makeStyles(() => ({
	mobileDrawer: {
		width: 256
	},
	desktopDrawer: {
		width: 256,
		top: 64,
		height: "calc(100% - 64px)"
	},
	avatar: {
		cursor: "pointer",
		width: 64,
		height: 64
	}
}));

const NavBar = ({ onMobileClose, openMobile }) => {
	const classes = useStyles();
	const location = useLocation();
	// eslint-disable-next-line no-unused-vars
	const [ userName, setUserName ] = useState("");
	const [ avatartoDisplay, setAvatarToDisplay ] = useState("");
	useEffect(
		() => {
			if (openMobile && onMobileClose) {
				onMobileClose();
			}
			if (localStorage.getItem("user")) {
				userProfile();
			}

			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		// eslint-disable-line react-hooks/exhaustive-deps
		[ location.pathname ]
	);

	const userProfile = async () => {
		try {
			let response = await aboutMe();
			setUserName(response.data.fullname);
			let av = response.data.avatar;
			let user_avatar = avatar_url + av;
			setAvatarToDisplay(user_avatar);
		} catch (error) {
			console.log(error);
		}
	};
	const content = (
		<Box height="100%" display="flex" flexDirection="column">
			<Box alignItems="center" display="flex" flexDirection="column" p={2}>
				<Avatar className={classes.avatar} component={RouterLink} src={avatartoDisplay} to="/app/account" />
				<br />
				<Typography className={classes.name} color="textPrimary" variant="h5">
					{
						userName !== undefined ? userName :
						""}
				</Typography>
				{/* <Typography color="textSecondary" variant="body2">
					{user.jobTitle}
				</Typography> */}
			</Box>
			<Divider />
			<Box p={2}>
				<List>
					{items.map((item) => (
						<NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
					))}
				</List>
			</Box>
			<Box flexGrow={1} />
		</Box>
	);

	return (
		<div>
			<Hidden lgUp>
				<Drawer
					anchor="left"
					classes={{ paper: classes.mobileDrawer }}
					onClose={onMobileClose}
					open={openMobile}
					variant="temporary"
				>
					{content}
				</Drawer>
			</Hidden>
			<Hidden mdDown>
				<Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
					{content}
				</Drawer>
			</Hidden>
		</div>
	);
};

NavBar.propTypes = {
	onMobileClose: PropTypes.func,
	openMobile: PropTypes.bool
};

NavBar.defaultProps = {
	onMobileClose: () => {},
	openMobile: false
};

export default NavBar;
