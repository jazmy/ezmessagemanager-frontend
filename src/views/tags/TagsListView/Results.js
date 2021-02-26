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
//Dialog represents to POPUP MODEL in whuuch we are doing add/edit job
import Dialog from "@material-ui/core/Dialog";
//DialogContent and DialogActions are the elements of Dialog
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
//IconButton is being represented in Action tab
import IconButton from "@material-ui/core/IconButton";
//we are calling Delete,Edit and Email Icon here.
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import "./result.css";
//toast
import { toast, Flip } from "react-toastify";
//We are invoking different methods here that we developd in an 'tagsservice' before.
import { addTag, getTags, deleteTagByID, updateTagByID } from "./tagsService";

//We are importing many useful UI elements here that we need to make our UI beautiful.
import {
	Icon,
	Box,
	Card,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
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
	//Start of state initlizations.

	// we are defining different states here by using useState hook
	//for more detail please check this.
	//https://reactjs.org/docs/hooks-state.html
	const [ tags, setTags ] = useState([]);
	const [ mode, setMode ] = useState("Add");
	const [ tag, setTag ] = useState("");
	const [ tagId, settagId ] = useState();
	const [ selectedTagIds, setselectedTagIds ] = useState([]);
	const [ limit, setLimit ] = useState(10);
	const [ flag, setFlag ] = useState(false);
	const [ page, setPage ] = useState(0);
	const [ openDialog, setOpenDialog ] = useState(false);
	//end of state initlizations.

	//filter area starts
	const [ tagnameFil, setTagNameFil ] = useState("");
	const [ tagIdFil, setTagIdFil ] = useState("");
	const [ createdAtFil, setcreatedAtFilFil ] = useState("");
	const [ updatedDateFil, setUpdatedDateFil ] = useState("");
	const [ associatedEmpFil, setAssociatedEmpFil ] = useState("");

	//filter area ends

	//this method plays with opening the model that handles edit/add tagss
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	//this method plays with closing the model that handles edit/add tagss
	const handleClose = () => {
		setOpenDialog(false);
	};

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllTags function to load all tagss.
	useEffect(() => {
		getAllTags();
	}, []);

	// this is our getAllTags function that get all users saved in Db
	const getAllTags = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getTags();
			// we are setting tags equals to response of our functional Call.
			// Note:- We defined gettags() in tagsService.
			setTags(response);
			return;
		} catch (error) {
			console.log(error);
			//Here we are catching the error, and returning it.
			toast.error("An Error Occured While getting the tags!", {
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

	//this is a function to update the tags, it accepts the index
	const updateTags = (index) => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let i = index;
			let obj = tags[i];
			//we have two modes in our state, one is add, another one is "update", it sets to update
			//as we want to update now.
			setMode("Update");
			//set other required properties, that needs to populate.
			settagId(obj.id);
			setTag(obj.tag);
			//finally it opens that POP-UP
			handleOpenDialog();
		} catch (error) {
			//Here we are catching the error, and returning it.
			toast.error("An Error Occured While updating the tags!", {
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

	//this function get executed by submit button of add/update dialoge
	//this decide if should we call ADDtags OR Update tags
	const operateFunction = (e) => {
		if (mode === "Add") {
			addtags(e);
		} else {
			//to update an tags
			// handleSubmit = Update tags
			handleSubmit(e);
		}
	};

	//We are adding an tags here.
	const addtags = async (e) => {
		e.preventDefault();

		try {
			//here we are checking if tag is empty then we return error else we let it pass

			if (!Boolean(tag)) {
				//Here we are catching the error, and returning it.
				toast.error("Please provide a valid tag name, you entered an empty one!", {
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
			} else {
				let response = await addTag(tag);
				//now we are checking if the status is 200, then we show success message and
				//clean the state to default values.
				if (response.status === 200) {
					toast.success(`Tag Added Successfully!`, {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						transition: Flip
					});
					setTag("");
					handleClose();
					getAllTags();
					return;
				}
			}
		} catch (error) {
			//Here we are catching the error, and returning it.
			toast.error("An Error Occured While Adding tag", {
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

	//Here we are going to perform operation of Update An tags
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!Boolean(tag)) {
				//Here we are catching the error, and returning it.
				toast.error("Please provide a valid tag name, you entered an empty one!", {
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
			} else {
				let response = await updateTagByID(tagId, tag);
				//now we are checking if the status is 200, then we show success message and
				//clean the state to default values.
				if (response.status === 200) {
					toast.success(`Tag Updated Successfully!`, {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						transition: Flip
					});
					setTag("");
					setMode("Add");
					//fetch all latest tagss.
					getAllTags();
					//close the dialouge
					handleClose();
					return;
				} else {
					toast.error("An Error Occured While Updating a tag!", {
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
		} catch (error) {
			// console.log(error);
			//Here we are catching the error, and returning it.
			toast.error("An Error Occured While Updating a tag!", {
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

	//Here we are going to perform operation of deleet An tags, this accepts index param...

	const deleteTag = async (index) => {
		try {
			let i = index;
			let obj = tags[i];
			//We are just confirming if a user really want to delete that guy?
			if (window.confirm(`Are you sure to delete ${obj.tag.toUpperCase()}!`)) {
				//as we have the id of a user so we wil delete
				let id = obj.id;
				await deleteTagByID(id);
				// after deleting that, we will filter our tags state, that is infact an
				//array type, to remove the deleted guy!
				let newtags = tags.filter((tg) => tg.id !== id);
				toast.success(`Tag Deleted Successfully`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				//we got new set of tags, so we will just re write it.
				setTags(newtags);
				return;
			} else {
				toast.error("An Error Occured While deleting a tag!", {
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
		} catch (error) {
			//Here we are catching the error, and returning it.

			toast.error("An Error Occured While deleting a tag!", {
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
	//this was developed by theme provider so ignore this
	const handleSelectAll = (event) => {
		if (tags.length > 0) {
			let newselectedTagIds = [];

			if (event.target.checked) {
				newselectedTagIds = tags.map((tg) => tg.id);
			} else {
				newselectedTagIds = [];
			}

			setselectedTagIds(newselectedTagIds);
			if (newselectedTagIds.length > 0) {
				setFlag(true);
			} else {
				setFlag(false);
			}
		}
	};

	const handleSelectOne = (event, id) => {
		const selectedIndex = selectedTagIds.indexOf(id);
		let newselectedTagIds = [];

		if (selectedIndex === -1) {
			newselectedTagIds = newselectedTagIds.concat(selectedTagIds, id);
		} else if (selectedIndex === 0) {
			newselectedTagIds = newselectedTagIds.concat(selectedTagIds.slice(1));
		} else if (selectedIndex === selectedTagIds.length - 1) {
			newselectedTagIds = newselectedTagIds.concat(selectedTagIds.slice(0, -1));
		} else if (selectedIndex > 0) {
			newselectedTagIds = newselectedTagIds.concat(
				selectedTagIds.slice(0, selectedIndex),
				selectedTagIds.slice(selectedIndex + 1)
			);
		}

		setselectedTagIds(newselectedTagIds);
		if (newselectedTagIds.length > 0) {
			setFlag(true);
		} else {
			setFlag(false);
		}
	};
	//this was developed by theme provider so ignore this

	//END

	//this check how many records should we show on page
	const handleLimitChange = (event) => {
		setLimit(event.target.value);
	};

	//this handle the page navigation etc inside a component
	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	// bulk delete
	const handleBulkDelete = async () => {
		try {
			if (confirm(`Are you sure to delete ${selectedTagIds.length} Tag(s)`)) {
				for (let index = 0; index < selectedTagIds.length; index++) {
					const element = selectedTagIds[index];
					let id = element;
					await deleteTagByID(id);
					if (index === selectedTagIds.length - 1) {
						toast.success(`Selected Tag(s) Deleted Successfully.`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						getAllTags();
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

	//this is a part where we are rendering the End User Part that he sees.
	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<Box display="flex" justifyContent="flex-end">
				{/* This is a button on top right side to ask if a user wants to add an tags
         it triggers handleOpenDialog function */}

				{
					flag ? <Button
						style={{ color: "red" }}
						color="default"
						onClick={handleBulkDelete}
						variant="contained"
					>
						<i className="fa fa-trash" aria-hidden="true" />
						Delete Selected Tag(s)
					</Button> :
					null}

				<Button color="primary" onClick={handleOpenDialog} variant="contained">
					<i className="fa fa-plus" aria-hidden="true" />
					Add New tags
				</Button>

				{/* we have a diaglog here to show POPUP */}
				{/* To learn how to play with forms please check folowing link
          https://reactjs.org/docs/forms.html 
          ****WE ARE USING SOME MORE ADVANCED WAY TO DO THIS***
          */}

				<Dialog
					classes={{
						paper: "m-24 rounded-8"
					}}
					open={openDialog}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
					fullWidth
					maxWidth="sm"
				>
					{/* <DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
				
					</DialogContent> */}

					<DialogContent classes={{ root: "p-24" }}>
						<div className="flex">
							<div className="min-w-24 pt-10">
								{/* This mode is what I described above, this is dynamic, decides on fly if we are going
                 to do "update or add" job */}
								<Icon color="action">{mode} Tag</Icon>
								<TextField
									className="mt-8 mb-16"
									label="Tag"
									id="tag"
									value={tag}
									name="tag"
									onChange={(e) => setTag(e.currentTarget.value)}
									placeholder="Tag"
									variant="outlined"
									fullWidth
								/>
							</div>
						</div>
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
							<Button variant="contained" color="primary" onClick={operateFunction} type="submit">
								{mode.toUpperCase()} Tag
							</Button>
						</div>
					</DialogActions>
				</Dialog>
			</Box>
			{/* Here table area stats */}
			<PerfectScrollbar>
				<Box minWidth={1050}>
					<Table>
						<TableHead>
							<TableRow>
								{/* This was developed by UI provider, so ignore that, we might need that in future */}
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedTagIds.length === tags.length}
										color="primary"
										indeterminate={selectedTagIds.length > 0 && selectedTagIds.length < tags.length}
										onChange={handleSelectAll}
									/>
								</TableCell>
								{/* rendering of header area starts from here */}
								<TableCell>
									Tag Name
									<input
										autoFocus
										placeholder="Tag Name"
										className="input-Style-For-tags"
										type="text"
										value={tagnameFil}
										onChange={(event) => {
											setTagNameFil(event.target.value);
										}}
									/>
								</TableCell>
								<TableCell>
									Tag ID
									<input
										placeholder="Tag Id Filter"
										className="input-Style-For-tags"
										type="text"
										value={tagIdFil}
										onChange={(event) => {
											setTagIdFil(event.target.value);
										}}
									/>
								</TableCell>

								<TableCell>
									Associated Employees.
									<input
										placeholder="Associated Employees Filter"
										className="input-Style-For-tags"
										type="text"
										value={associatedEmpFil}
										onChange={(event) => {
											setAssociatedEmpFil(event.target.value);
										}}
									/>
								</TableCell>
								<TableCell>
									Created At
									<input
										placeholder="Created at Date Filter"
										className="input-Style-For-tags"
										type="text"
										value={createdAtFil}
										onChange={(event) => {
											setcreatedAtFilFil(event.target.value);
										}}
									/>
								</TableCell>

								<TableCell>
									Updated At
									<input
										placeholder="Upated at Date Filter"
										className="input-Style-For-tags"
										type="text"
										value={updatedDateFil}
										onChange={(event) => {
											setUpdatedDateFil(event.target.value);
										}}
									/>
								</TableCell>
								<TableCell>Action</TableCell>
								{/* rendering of header area ends  here */}
							</TableRow>
						</TableHead>

						{/* BODY OF TABLE STARTS FROM HERE
             =>we check that id length of an tags array is greater than zero, then
            =>we renders/ map it else, we return null to avoide potentially errors 
            */}

						<TableBody key={page}>
							{
								tags.length > 0 ? tags
									.slice(page * limit, (page + 1) * limit)
									.filter((val) => {
										if (
											tagnameFil === "" &&
											associatedEmpFil === "" &&
											tagIdFil === "" &&
											createdAtFil === "" &&
											updatedDateFil === ""
										) {
											return val;
										} else if (
											val.tag.toLowerCase().includes(tagnameFil.toLowerCase()) &&
											val.employees.length
												.toString()
												.toLowerCase()
												.includes(associatedEmpFil.toString().toLowerCase()) &&
											val.id
												.toString()
												.toLowerCase()
												.includes(tagIdFil.toString().toLowerCase()) &&
											val.created_at.toLowerCase().includes(createdAtFil.toLowerCase()) &&
											val.updated_at.toLowerCase().includes(updatedDateFil.toLowerCase())
										) {
											return val;
										}
									})
									.map((tg, index) => (
										<TableRow hover key={tg.id} selected={selectedTagIds.indexOf(tg.id) !== -1}>
											<TableCell padding="checkbox">
												<Checkbox
													checked={selectedTagIds.indexOf(tg.id) !== -1}
													onChange={(event) => handleSelectOne(event, tg.id)}
													value="true"
												/>
											</TableCell>

											<TableCell>{tg.tag}</TableCell>
											<TableCell>{tg.id}</TableCell>
											<TableCell>{tg.employees.length}</TableCell>
											{/* Here we are using moment to display date in beautiful form */}
											<TableCell>{moment(tg.created_at).format("DD/MM/YYYY")}</TableCell>
											<TableCell>{moment(tg.updated_at).format("DD/MM/YYYY")}</TableCell>
											{/* Buttons area to send email/edit/delete starts from here */}
											<TableCell>
												<IconButton
													aria-label="Update"
													onClick={() => updateTags(index)}
													className={classes.margin}
												>
													<EditIcon />
												</IconButton>

												<IconButton
													aria-label="delete"
													onClick={() => deleteTag(index)}
													className={classes.margin}
												>
													<DeleteIcon />
												</IconButton>
												{/* Buttons area to send email/edit/delete starts ends here */}
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
				count={tags.length}
				onChangePage={handlePageChange}
				onChangeRowsPerPage={handleLimitChange}
				page={page}
				rowsPerPage={limit}
				rowsPerPageOptions={[ 5, 10, 25 ]}
			/>
		</Card>
	);
};

Results.propTypes = {
	className: PropTypes.string
};

//so boom! we exports this from here and consumes in Index.js to display to the potential pair
// of eyes
export default Results;
