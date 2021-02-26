//We are importing react instance, and hooks that are as " useState & useEffect"
import React, { useState, useEffect } from "react";
//We are importing "clsx" for styling of our UI (table)
import clsx from "clsx";
//PropTypes :- this works under the hood for styling. We are doing ClassName work here, that
//...provides the style.
import PropTypes from "prop-types";
//We are importing the Library "moment"  that gives a shape to DateTime.
import moment from "moment";
//PerfectScrollbar is an element of that provides functionality to scroll.
import PerfectScrollbar from "react-perfect-scrollbar";
//sendAnEmail, getEmailLogs are functions defined in mailService
import { sendAnEmail, getEmailLogs, deleteEmailLogs } from "../../shared/mailService";
//Dialog represents to POPUP MODEL in whuuch we are doing sending email
import Dialog from "@material-ui/core/Dialog";
//DialogContent and DialogActions are the elements of Dialog
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
//to get multiple email addresses, we are using tags input, we developed it eailer
import TagsInput from "../../shared/TagsInput";
//toast area
import { toast, Flip } from "react-toastify";
import "./result.css";
//We are importing many useful UI elements here that we need to make our UI beautiful.

import {
	Box,
	Card,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
	makeStyles,
	Button,
	TextField
} from "@material-ui/core";
import { deleteEmailTemplate } from "src/views/mailsdesigner/MailsDesignerView/mailTemplateService";
//makeStyles is hook in '@material-ui/core', that is an initilizer to give styling
const useStyles = makeStyles((theme) => ({
	root: {},
	avatar: {
		marginRight: theme.spacing(2)
	}
}));
//We are defining our custom functional component named as Results here, that accepts (or may accept) classes and other params by index.js
const Results = ({ className, ...rest }) => {
	//we initilized classes vaiable here.
	const classes = useStyles();
	// we are defining different states here by using useState hook
	//for more detail please check this.
	//https://reactjs.org/docs/hooks-state.html
	const [ selectedmailIds, setSelectedmailIds ] = useState([]);
	const [ limit, setLimit ] = useState(10);
	const [ flag, setFlag ] = useState(false);
	const [ page, setPage ] = useState(0);
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ from, setFrom ] = useState([]);
	const [ subject, setSubject ] = useState("");
	const [ text, setText ] = useState("a testing for now - will polish in 2nd milestone");
	const [ html, setHtml ] = useState("");
	const [ allEmails, setAllEmails ] = useState([]);
	const [ emailLogs, setEmailLogs ] = useState([]);
	//filter area states starts

	const [ emailFil, setEmailFil ] = useState("");
	const [ subjFil, setSubjFil ] = useState("");
	const [ textFil, setTextFil ] = useState("");
	const [ statusFil, setStatusFil ] = useState("");
	const [ dateSentFil, setDateSentFil ] = useState("");

	//filter area states ends
	//end of state initlizations.
	const selectedTags = (tags) => {
		setAllEmails(tags);
	};

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllEmailLogs function to load all EmailLogs.

	useEffect(() => {
		getAllEmailLogs();
	}, []);
	// this is our getAllEmailLogs function that get all EmailLogs saved in Db
	const getAllEmailLogs = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getEmailLogs();
			// we are setting employee equals to response of our functional Call.
			// Note:- We defined getEmailLogs() in emailSERVICE.
			setEmailLogs(response);
			return;
		} catch (error) {
			// console.log(error);
			//Here we are catching the error, and returning it.

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

	//this was developed by theme provider so ignore this
	const handleSelectAll = (event) => {
		if (emailLogs.length > 0) {
			let newSelectedmailIds;
			if (event.target.checked) {
				newSelectedmailIds =

						emailLogs != null ? emailLogs.map((mail) => mail.id) :
						null;
			} else {
				newSelectedmailIds = [];
			}

			setSelectedmailIds(newSelectedmailIds);
			if (newSelectedmailIds.length > 0) {
				setFlag(true);
			} else {
				setFlag(false);
			}
		}
	};

	const handleSelectOne = (event, id) => {
		const selectedIndex = selectedmailIds.indexOf(id);
		let newSelectedmailIds = [];
		if (selectedIndex === -1) {
			newSelectedmailIds = newSelectedmailIds.concat(selectedmailIds, id);
		} else if (selectedIndex === 0) {
			newSelectedmailIds = newSelectedmailIds.concat(selectedmailIds.slice(1));
		} else if (selectedIndex === selectedmailIds.length - 1) {
			newSelectedmailIds = newSelectedmailIds.concat(selectedmailIds.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelectedmailIds = newSelectedmailIds.concat(
				selectedmailIds.slice(0, selectedIndex),
				selectedmailIds.slice(selectedIndex + 1)
			);
		}
		setSelectedmailIds(newSelectedmailIds);
		if (newSelectedmailIds.length > 0) {
			setFlag(true);
		} else {
			setFlag(false);
		}
	};
	//this was developed by theme provider so ignore this

	//END

	// bulk delete
	const handleBulkDelete = async () => {
		try {
			if (confirm(`Are you sure to delete ${selectedmailIds.length} Mail Log(s)`)) {
				for (let index = 0; index < selectedmailIds.length; index++) {
					const element = selectedmailIds[index];
					let id = element;
					await deleteEmailLogs(id);
					if (index === selectedmailIds.length - 1) {
						toast.success(`Selected Mail Logs Deleted Successfully`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						getAllEmailLogs();
						setFlag(false);
						return;
					}
				}
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

	//this check how many records should we show on page
	const handleLimitChange = (event) => {
		setLimit(event.target.value);
	};

	//this handle the page navigation etc inside a component
	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};
	//this is a part where we are rendering the End User Part that he sees.
	return (
		<div>
			<Card className={clsx(classes.root, className)} {...rest}>
				<div className={clsx(classes.root, className)} {...rest}>
					<Box display="flex" justifyContent="flex-end">
						{
							flag ? <Button
								style={{ color: "red" }}
								color="default"
								onClick={handleBulkDelete}
								variant="contained"
							>
								<i className="fa fa-trash" aria-hidden="true" />
								Delete Selected Mail Logs
							</Button> :
							null}

						{/* we have a diaglog here to show POPUP */}
						{/* To learn how to play with forms please check folowing link
          https://reactjs.org/docs/forms.html 
          ****WE ARE USING SOME MORE ADVANCED WAY TO DO THIS***
          */}
					</Box>
				</div>

				<PerfectScrollbar>
					<Box minWidth={1050}>
						{/* Here table area stats */}
						<Table>
							<TableHead>
								<TableRow>
									{/* This was developed by UI provider, so ignore that, we might need that in future */}
									<TableCell padding="checkbox">
										<Checkbox
											checked={selectedmailIds.length === emailLogs.length}
											color="primary"
											indeterminate={
												selectedmailIds.length > 0 && selectedmailIds.length < emailLogs.length
											}
											onChange={handleSelectAll}
										/>
									</TableCell>
									{/* rendering of header area starts from here */}
									<TableCell>
										Email Address
										<input
											autoFocus
											placeholder="Email To Filter"
											className="input-Style"
											type="text"
											value={emailFil}
											onChange={(event) => {
												setEmailFil(event.target.value);
											}}
										/>
									</TableCell>
									<TableCell>
										Subject
										<input
											placeholder="Subject To Filter"
											className="input-Style"
											type="text"
											value={subjFil}
											onChange={(event) => {
												setSubjFil(event.target.value);
											}}
										/>
									</TableCell>
									<TableCell>
										Message (short)
										<input
											placeholder="Short Message To Filter"
											className="input-Style"
											type="text"
											value={textFil}
											onChange={(event) => {
												setTextFil(event.target.value);
											}}
										/>
									</TableCell>
									<TableCell>
										Date Sent
										<input
											placeholder="Date To Filter"
											className="input-Style"
											type="text"
											value={dateSentFil}
											onChange={(event) => {
												setDateSentFil(event.target.value);
											}}
										/>
									</TableCell>
									<TableCell>
										Status
										<input
											placeholder="Status To Filter"
											className="input-Style"
											type="text"
											value={statusFil}
											onChange={(event) => {
												setStatusFil(event.target.value);
											}}
										/>
									</TableCell>
									{/* rendering of header area ends  here */}
								</TableRow>
							</TableHead>
							<TableBody key={page}>
								{/* BODY OF TABLE STARTS FROM HERE
             =>we check that id length of an emailLogs array is greater than zero, then
            =>we renders/ map it else, we return null to avoide potentially errors 
            */}
								{
									emailLogs.length > 0 ? emailLogs
										.slice(page * limit, (page + 1) * limit)
										.filter((val) => {
											if (
												emailFil === "" &&
												subjFil === "" &&
												textFil === "" &&
												statusFil === "" &&
												dateSentFil === ""
											) {
												return val;
											} else if (
												val.email.toLowerCase().includes(emailFil.toLowerCase()) &&
												val.subject.toLowerCase().includes(subjFil.toLowerCase()) &&
												val.text.toLowerCase().includes(textFil.toLowerCase()) &&
												val.status.toLowerCase().includes(statusFil.toLowerCase()) &&
												val.datesent.toLowerCase().includes(dateSentFil.toLowerCase())
											) {
												return val;
											}
										})
										.map((mail) => (
											<TableRow
												hover
												key={mail.id}
												selected={selectedmailIds.indexOf(mail.id) !== -1}
											>
												<TableCell padding="checkbox">
													<Checkbox
														checked={selectedmailIds.indexOf(mail.id) !== -1}
														onChange={(event) => handleSelectOne(event, mail.id)}
														value="true"
													/>
												</TableCell>
												<TableCell>
													<Box alignItems="center" display="flex">
														<Typography color="textPrimary" variant="body1">
															{mail.email}
														</Typography>
													</Box>
												</TableCell>
												<TableCell>{mail.subject}</TableCell>
												<TableCell>{mail.text}</TableCell>
												{/* Here we are using moment to display date in beautiful form */}
												<TableCell>{moment(mail.datesent).format("DD/MM/YYYY")}</TableCell>
												<TableCell>{mail.status}</TableCell>
											</TableRow>
										)) :
									null}
							</TableBody>
						</Table>
						{/* Here table area ends */}
					</Box>
				</PerfectScrollbar>

				{/* this deals with page options like how many records per page should we render */}
				<TablePagination
					component="div"
					count={emailLogs.length}
					onChangePage={handlePageChange}
					onChangeRowsPerPage={handleLimitChange}
					page={page}
					rowsPerPage={limit}
					rowsPerPageOptions={[ 5, 10, 25 ]}
				/>
			</Card>
		</div>
	);
};

Results.propTypes = {
	className: PropTypes.string
};
//so boom! we exports this from here and consumes in Index.js!
export default Results;
