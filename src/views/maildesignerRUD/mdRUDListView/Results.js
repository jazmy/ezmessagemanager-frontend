//We are importing react instance, and hooks that are as " useState & useEffect"
import React, { useState, useEffect, useRef } from "react";
//We are importing "clsx" for styling of our UI (table)
import clsx from "clsx";
//PropTypes :- this works under the hood for styling. We are doing ClassName work here, that
//...provides the style.
import PropTypes from "prop-types";
//link to navigate
import { Link } from "react-router-dom";
//We are importing the Library "moment"  that gives a shape to DateTime.
import moment from "moment";
//PerfectScrollbar is an element of that provides functionality to scroll.
import PerfectScrollbar from "react-perfect-scrollbar";
//Dialog represents to POPUP MODEL in whuuch we are doing add/edit job
import Dialog from "@material-ui/core/Dialog";
//DialogContent and DialogActions are the elements of Dialog
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
//IconButton is being represented in Action tab
import IconButton from "@material-ui/core/IconButton";
//we are calling Delete,Edit and before Icon here.
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import "./result.css";
//email service
import {
	getEmailTemplates,
	deleteEmailTemplate,
	updateEmailTemplate,
	getEployeesMetaFields
} from "./../../mailsdesigner/MailsDesignerView/mailTemplateService";
//toast area
import { toast, Flip } from "react-toastify";
//we are importing that dynamic email builder module here
import EmailEditor from "react-email-editor";

//We are importing many useful UI elements here that we need to make our UI beautiful.
import {
	Icon,
	Box,
	Card,
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

//makeStyles is hook in '@material-ui/core', that is an initilizer to give styling
const useStyles = makeStyles((theme) => ({
	root: {},
	avatar: {
		marginRight: theme.spacing(2)
	},
	margin: {
		margin: theme.spacing(1)
	},
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}));

//We are defining our custom functional component named as Results here, that accepts (or may accept) classes and other params by index.js
const Results = ({ className, ...rest }) => {
	//we initilized classes vaiable here.
	const classes = useStyles();
	const emailEditorRef = useRef(null);

	//Start of state initlizations.
	// we are defining different states here by using useState hook
	//for more detail please check this.
	//https://reactjs.org/docs/hooks-state.html

	const [ emailTemplatess, setemailTemplatess ] = useState([]);
	const [ emailTemplateId, setEmailTemplateId ] = useState("");
	const [ templatename, setTemplatename ] = useState("");
	const [ subject, setSubject ] = useState("");
	const [ shortmessage, setShortMessage ] = useState("");

	const [ templatedesign, setTemplatedDesign ] = useState("");
	const [ limit, setLimit ] = useState(10);
	const [ page, setPage ] = useState(0);
	const [ openDialog, setOpenDialog ] = useState(false);

	//end of state initlizations.

	//filter area states starts
	const [ templateNameFil, setTemplateNameFil ] = useState("");
	const [ subjFil, setSubjFil ] = useState("");
	const [ textFil, setTextFil ] = useState("");
	const [ createdAtFil, setCreatedAtFil ] = useState("");
	const [ updatedAtFil, setUpdatedAtFil ] = useState("");
	const [ metaFields, setMetaFields ] = useState([]);
	//filter area states ends

	//this method plays with closing the model that handles edit/add emailTemplatess
	const handleClose = () => {
		getAllemailTemplatess();
		setEmailTemplateId("");
		setTemplatename("");
		setSubject("");
		setShortMessage("");
		setTemplatedDesign("");
		setOpenDialog(false);
	};
	//this method plays with opening the model that handles edit/add emailTemplatess
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllemailTemplatess function to load all emailTemplatess.
	useEffect(() => {
		getAllemailTemplatess();
		getAllMetaFields();
	}, []);
	const getAllMetaFields = async () => {
		try {
			let response = await getEployeesMetaFields();
			console.log(response);
			setMetaFields(response);
		} catch (error) {}
	};

	const getAllemailTemplatess = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getEmailTemplates();
			setemailTemplatess(response);
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
	//this is a function to update the emailTemplates, it accepts the index
	const updateemailTemplates = (index) => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let emailTemplatearray = emailTemplatess;
			let obj = emailTemplatearray.filter((item) => {
				return item.id == index;
			});

			//set other required properties, that needs to populate.
			setEmailTemplateId(obj[0].id);
			setTemplatename(obj[0].templatename);
			setSubject(obj[0].subject);
			setShortMessage(obj[0].shortmessage);
			setTemplatedDesign(obj[0].templatedesign);
			//finally it opens that POP-UP
			handleOpenDialog();
		} catch (error) {
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

	//to remove the tag

	//Here we are going to perform operation of Update An emailTemplates
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			//update here
			emailEditorRef.current.editor.exportHtml((data) => {
				const { html, design } = data;
				let templatedesigntoSend = encodeURIComponent(JSON.stringify(design));

				let longmessage = escape(html);
				//we sent the request to the method that was developed in mailService.
				toast.success(`Updating template...`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				updateEmailTemplate(
					emailTemplateId,
					templatename,
					subject,
					shortmessage,
					longmessage,
					templatedesigntoSend
				).then((response) => {
					// now we are checking if the status is 200, then we show success message and
					// clean the state to default values.
					if (response.status === 200) {
						toast.success(`Template Updated Successfully!`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						setTemplatename("");
						setSubject("");
						setShortMessage("");
						window.location.reload();
						return;
					}
				});
			});
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

	//Here we are going to perform operation of deleet An emailTemplates, this accepts index param...

	const deleteemailTemplates = async (index) => {
		try {
			let emailTemplatearray = emailTemplatess;
			let obj = emailTemplatearray.filter((item) => {
				return item.id == index;
			});

			//We are just confirming if a user really want to delete that guy?
			if (window.confirm(`Are you sure to delete ${obj[0].templatename.toUpperCase()}!`)) {
				//as we have the id of a user so we wil delete
				let id = obj[0].id;
				await deleteEmailTemplate(id);
				// after deleting that, we will filter our emailTemplates state, that is infact an
				//array type, to remove the deleted guy!
				let newemailTemplates = emailTemplatess.filter((ct) => ct.id !== id);
				toast.success(`Email Template Deleted Successfully `, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				//we got new set of emailTemplates, so we will just re write it.
				setemailTemplatess(newemailTemplates);
				return;
			} else {
				return;
			}
		} catch (error) {
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

			return;
		}
	};

	//END

	//area of template passing

	const onLoad = () => {
		setTimeout(async () => {
			if (emailEditorRef.current) {
				let response = await getEployeesMetaFields();
				const customTags = {};
				for (let i = 0; i < response.length; i++) {
					customTags[response[i].field_name.toUpperCase()] = {
						name: response[i].field_name.toUpperCase(),
						value: `{{${response[i].field_name}}}`
					};
				}

				let toDecode = decodeURIComponent(templatedesign);
				let json = JSON.parse(toDecode);
				let design = json;
				emailEditorRef.current.loadDesign(design);
				emailEditorRef.current.setMergeTags({
					firstname: {
						name: "First Name",
						value: "{{firstname}}"
					},
					lastname: {
						name: "Last Name",
						value: "{{lastname}}"
					},
					hiredate: {
						name: "Hire Date",
						value: "{{hiredate}}"
					},

					created_at: {
						name: "Account Creation Date",
						value: "{{created_at}}"
					},
					updated_at: {
						name: "Account Updation Date & time",
						value: "{{updated_at}}"
					},
					...customTags
				});
			}
		}, 5000);
	};

	//navigate to designer

	const navigateTodesigner = () => {
		window.location = "/app/designer";
		return;
	};

	//area end of template passing
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
						<Link to={"/app/designer"}>
							<Button style={{ float: "right" }} color="primary" variant="contained">
								<i className="fa fa-plus" />
								Add New Template
							</Button>
						</Link>

						{/* This is a button on top right side to ask if a user wants to add an emailTemplates
         it triggers handleOpenDialog function */}

						{/* we have a diaglog here to show POPUP */}
						{/* To learn how to play with forms please check folowing link
          https://reactjs.org/docs/forms.html 
          ****WE ARE USING SOME MORE ADVANCED WAY TO DO THIS***
          */}

						<div style={{ maxWidth: 1600 }}>
							<Dialog
								classes={{
									paper: "rounded-24"
								}}
								open={openDialog}
								onClose={handleClose}
								aria-labelledby="form-dialog-title"
								fullWidth={true}
								maxWidth={"lg"}
							>
								<DialogContent classes={{ root: "p-32 pb-0 " }}>
									<div className="flex">
										<div className="min-w-24 pt-10">
											{/* This mode is what I described above, this is dynamic, decides on fly if we are going
                 to do "update or add" job */}
											<Icon color="action">Update the Email Template</Icon>
										</div>
										<br />
										<br />
										<TextField
											className="mt-8 mb-8"
											label="Name of Template"
											autoFocus
											type="text"
											value={templatename}
											name="templatename"
											onChange={(e) => setTemplatename(e.currentTarget.value)}
											placeholder="Name Of Template"
											variant="outlined"
											fullWidth
										/>

										<br />
									</div>

									<br />
									<TextField
										className="mt-8 mb-8"
										label="Subject"
										type="text"
										value={subject}
										name="subject"
										onChange={(e) => setSubject(e.currentTarget.value)}
										placeholder="Subject"
										variant="outlined"
										fullWidth
									/>

									<br />
									<br />

									<TextField
										className="mt-8 mb-8"
										label="Short Message"
										type="text"
										value={shortmessage}
										name="shortmessage"
										onChange={(e) => setShortMessage(e.currentTarget.value)}
										placeholder="Short Message"
										variant="outlined"
										fullWidth
									/>
									<br />
									<br />

									<div>
										<EmailEditor ref={emailEditorRef} onLoad={onLoad} />
									</div>
									<br />
								</DialogContent>
								<DialogActions className="justify-between p-8">
									{/* Buttons Area */}
									<div className="px-16">
										<Button
											style={{ alignItems: "left", marginRight: 10 }}
											variant="contained"
											color="secondary"
											onClick={handleClose}
										>
											Close
										</Button>
										{/* It calls operateFunction fun. that decides on the base of mode that what should it do */}
										<Button
											variant="contained"
											color="primary"
											onClick={handleSubmit}
											type="submit"
										>
											Update Email Template
										</Button>
									</div>
								</DialogActions>
							</Dialog>
						</div>
					</Box>
					{/* Here table area stats */}
					<PerfectScrollbar>
						<Box minWidth={1050}>
							<Table>
								<TableHead>
									<TableRow>
										{/* This was developed by UI provider, so ignore that, we might need that in future */}
										<TableCell padding="checkbox" />
										{/* rendering of header area starts from here */}
										<TableCell>
											Name Of Template
											<input
												autoFocus
												placeholder="Name To Filter"
												className="input-Style-For-designer"
												type="text"
												value={templateNameFil}
												onChange={(event) => {
													setTemplateNameFil(event.target.value);
												}}
											/>
										</TableCell>

										<TableCell>
											Subject
											<input
												placeholder="Subject To Filter"
												className="input-Style-For-designer"
												type="text"
												value={subjFil}
												onChange={(event) => {
													setSubjFil(event.target.value);
												}}
											/>
										</TableCell>
										<TableCell>
											Short Message
											<input
												placeholder="Short Message To Filter"
												className="input-Style-For-designer"
												type="text"
												value={textFil}
												onChange={(event) => {
													setTextFil(event.target.value);
												}}
											/>
										</TableCell>
										<TableCell>
											Created At
											<input
												placeholder="Created Date To Filter"
												className="input-Style-For-designer"
												type="text"
												value={createdAtFil}
												onChange={(event) => {
													setCreatedAtFil(event.target.value);
												}}
											/>
										</TableCell>
										<TableCell>
											Update At
											<input
												placeholder="Updated Date To Filter"
												className="input-Style-For-designer"
												type="text"
												value={updatedAtFil}
												onChange={(event) => {
													setUpdatedAtFil(event.target.value);
												}}
											/>
										</TableCell>
										<TableCell>Action</TableCell>
										{/* rendering of header area ends  here */}
									</TableRow>
								</TableHead>

								{/* BODY OF TABLE STARTS FROM HERE
             =>we check that id length of an emailTemplates array is greater than zero, then
            =>we renders/ map it else, we return null to avoide potentially errors 
            */}

								<TableBody key={page}>
									{
										emailTemplatess.length > 0 ? emailTemplatess
											.slice(page * limit, (page + 1) * limit)
											.filter((val) => {
												if (
													templateNameFil === "" &&
													subjFil === "" &&
													textFil === "" &&
													createdAtFil === "" &&
													updatedAtFil === ""
												) {
													return val;
												} else if (
													val.templatename
														.toLowerCase()
														.includes(templateNameFil.toLowerCase()) &&
													val.subject.toLowerCase().includes(subjFil.toLowerCase()) &&
													val.shortmessage.toLowerCase().includes(textFil.toLowerCase()) &&
													val.created_at.toLowerCase().includes(createdAtFil.toLowerCase()) &&
													val.updated_at.toLowerCase().includes(updatedAtFil.toLowerCase())
												) {
													return val;
												}
											})
											.map((et, index) => (
												<TableRow hover key={et.id}>
													<TableCell padding="checkbox" />
													<TableCell>
														<Box alignItems="center" display="flex">
															<Typography color="textPrimary" variant="body1">
																{et.templatename}
															</Typography>
														</Box>
													</TableCell>

													{/* Here we are using moment to display date in beautiful form */}

													<TableCell>{et.subject}</TableCell>
													<TableCell>{et.shortmessage}</TableCell>
													<TableCell>{moment(et.created_at).format("DD/MM/YYYY")}</TableCell>
													<TableCell>{moment(et.updated_at).format("DD/MM/YYYY")}</TableCell>
													{/* Buttons area to send before/edit/delete starts from here */}
													<TableCell>
														<IconButton
															aria-label="Update"
															onClick={() => updateemailTemplates(et.id)}
															className={classes.margin}
														>
															<EditIcon />
														</IconButton>

														<IconButton
															aria-label="delete"
															onClick={() => deleteemailTemplates(et.id)}
															className={classes.margin}
														>
															<DeleteIcon />
														</IconButton>
														{/* Buttons area to send before/edit/delete starts ends here */}
													</TableCell>
													<TableCell />
												</TableRow>
											)) :
										null}
								</TableBody>
							</Table>
						</Box>
					</PerfectScrollbar>

					{/* this deals with page options like how many records per page should we render */}
					<TablePagination
						component="div"
						count={emailTemplatess.length}
						onChangePage={handlePageChange}
						onChangeRowsPerPage={handleLimitChange}
						page={page}
						rowsPerPage={limit}
						rowsPerPageOptions={[ 5, 10, 25 ]}
					/>
				</div>
			</Card>
		</div>
	);
};

Results.propTypes = {
	className: PropTypes.string
};

//so boom! we exports this from here and consumes in Index.js to display to the potential pair
// of eyes
export default Results;
