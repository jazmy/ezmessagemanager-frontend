//We are importing react instance, and hooks that are as " useState & useEffect"
import React, { useState, useEffect, useRef } from "react";
//we are importing that dynamic email builder module here
import EmailEditor from "react-email-editor";
//We are importing "clsx" for styling of our UI
import clsx from "clsx";
//PropTypes :- this works under the hood for styling. We are doing ClassName work here, that
//...provides the style.
import PropTypes from "prop-types";
//for storing the emails templates

import { storeTemplate, getEployeesMetaFields } from "./mailTemplateService.js";
//toast area
import { toast, Flip } from "react-toastify";
//We are importing many useful UI elements here that we need to make our UI beautiful.
import { Box, Card, makeStyles, Button, TextField } from "@material-ui/core";
//DialogContent and DialogActions are the elements of Dialog
import DialogContent from "@material-ui/core/DialogContent";
//makeStyles is hook in '@material-ui/core', that is an initilizer to give styling
const useStyles = makeStyles((theme) => ({
	root: {},
	avatar: {
		marginRight: theme.spacing(2)
	}
}));
//We are defining our custom functional component named as Results here, that accepts (or may accept) classes and other params by index.js
const Results = ({ className, ...rest }) => {
	//reference to email editior
	const emailEditorRef = useRef(null);
	//we initilized classes vaiable here.
	const classes = useStyles();

	const [ templatename, settemplatename ] = useState([]);
	const [ subject, setSubject ] = useState("");
	const [ shortmessage, setshortmessage ] = useState("");
	const [ metaFields, setMetaFields ] = useState([]);

	//end of state initlizations.

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllEmailLogs function to load all EmailLogs.

	useEffect(() => {
		getAllMetaFields();
	}, []);

	const getAllMetaFields = async () => {
		try {
			let response = await getEployeesMetaFields();
			console.log(response);
			setMetaFields(response);
		} catch (error) {}
	};

	//when Dom Loads, we provide our mergetags
	const onLoad = () => {
		setTimeout(async () => {
			if (emailEditorRef.current) {
				// console.log(toDecode);
				// let json = JSON.parse(toDecode);
				// let design = json;
				// emailEditorRef.current.loadDesign(design);
				let response = await getEployeesMetaFields();
				const customTags = {};
				for (let i = 0; i < response.length; i++) {
					customTags[response[i].field_name.toUpperCase()] = {
						name: response[i].field_name.toUpperCase(),
						value: `{{${response[i].field_name}}}`
					};
				}

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

	//so here we are sending actual emails
	async function addTemplate(e) {
		e.preventDefault();
		//In try block, we will try to execute our logic if works fine.
		try {
			//first of all we are setting our dynamic html here

			// emailEditorRef.current.saveDesign(function(design) {
			// 	// console.log('design', design);
			// 	// console.log(JSON.stringify(design));
			// 	//this would work
			// 	// let dd = encodeURIComponent(JSON.stringify(design));
			// 	// console.log(dd);
			// });
			// return;
			emailEditorRef.current.editor.exportHtml((data) => {
				const { html, design } = data;
				let templatedesign = encodeURIComponent(JSON.stringify(design));

				// let htmlgen = JSON.stringify(html);
				let longmessage = escape(html);
				//we sent the request to the method that was developed in mailService.
				toast.success(`Storing template...! `, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				storeTemplate(templatename, subject, shortmessage, longmessage, templatedesign).then((response) => {
					// now we are checking if the status is 200, then we show success message and
					// clean the state to default values.
					if (response.status === 200) {
						toast.success(`Template Saved Successfully!'`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						settemplatename("");
						setSubject("");
						setshortmessage("");
						window.location.reload();
						return;
					}
				});
			});
		} catch (error) {
			//we closed the dialouge in case if we got an error!
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
	}

	//this is a part where we are rendering the End User Part that he sees.
	return (
		<div>
			<Card className={clsx(classes.root, className)} {...rest}>
				<div className={clsx(classes.root, className)} {...rest}>
					<Box display="flex" justifyContent="space-around">
						<div className="p-24">
							<div
								aria-labelledby="form-dialog-title"
								classes={{
									paper: "rounded-12"
								}}
							>
								<DialogContent classes={{ root: "p-16 pb-0 sm:p-24 sm:pb-0" }}>
									{/* <div style={{ marginTop: 20 }}> */}
									<TextField
										style={{ marginTop: 20 }}
										className="mt-8 mb-8"
										label="Template Name"
										id="templatename"
										type="text"
										value={templatename}
										name="templatename"
										onChange={(e) => settemplatename(e.currentTarget.value)}
										variant="outlined"
										fullWidth
									/>
									<br />
									<br />
									<TextField
										className="mt-8 mb-8 sm-8"
										label="Subject"
										id="subject"
										value={subject}
										name="subject"
										onChange={(e) => setSubject(e.currentTarget.value)}
										placeholder="subject"
										variant="outlined"
										fullWidth
									/>
									<br />
									<br />
									<TextField
										className="mt-8 mb-8 sm-8"
										label="Short Message"
										id="shortmessage"
										value={shortmessage}
										name="subject"
										onChange={(e) => setshortmessage(e.currentTarget.value)}
										placeholder="shortmessage"
										variant="outlined"
										fullWidth
									/>
									<br />
									<br />
									<EmailEditor ref={emailEditorRef} onLoad={onLoad} />
									<br /> <br />
									{/* </div> */}
								</DialogContent>

								<div>
									{/* Buttons Area */}
									<div>
										<Button
											style={{ marginLeft: 1000 }}
											variant="contained"
											color="primary"
											onClick={addTemplate}
										>
											ADD
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Box>
				</div>
			</Card>
		</div>
	);
};

Results.propTypes = {
	className: PropTypes.string
};
//so boom! we exports this from here and consumes in Index.js!
export default Results;
