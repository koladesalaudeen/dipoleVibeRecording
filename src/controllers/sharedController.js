const express = require("express");
const router = express.Router();
const sharedServices = require("../services/sharedServices"); // Adjust the path accordingly

// Create a new Shared document
async function createShared(req, res) {
  try {
    const videoBuffer = req.file.buffer;

    if (!videoBuffer) {
        return res.status(400).json({ message: "No video data provided." });
    }

    const { author, email:recipientsMail, title, summary } = req.body;
    // console.log(req.body);

    const newSharedDocument = await sharedServices.createShared(author, videoBuffer, recipientsMail, title, summary);

    res.status(200).json({message: newSharedDocument});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete a Shared document by ID
async function deleteShared(req, res) {
  try {
    const { sharedId } = req.params;
    const deletedSharedDocument = await sharedServices.deleteSharedById(sharedId);
    res.status(200).json({message: deletedSharedDocument});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update recipientsMail for a Shared document by ID
async function updateRecipientsMail(req, res) {
  try {
    const { sharedId } = req.params;
    const { newRecipientsMail } = req.body;
    const updatedSharedDocument = await sharedServices.updateRecipientsMail(sharedId, newRecipientsMail);
    res.json(updatedSharedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Search for Shared documents based on a specific column value
async function searchSharedByColumn(req, res) {
  try {
    const { columnName, columnValue } = req.query;
    const matchingSharedDocuments = await sharedServices.searchSharedByColumn(columnName, columnValue);
    res.json(matchingSharedDocuments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Search for Shared documents created on or after a specific date
async function searchSharedByDate(req, res) {
  try {
    const { startDate } = req.query;
    const matchingSharedDocuments = await sharedServices.searchSharedByDate(new Date(startDate));
    res.json(matchingSharedDocuments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function searchSharedByRecipientsMail(req,res){
    try {
        const { email } = req.query;
        const matchingSharedDocuments = await sharedServices.searchSharedByRecipientsMail(email);
        res.json(matchingSharedDocuments);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

async function getAllShared(req,res){
    try {
        const allShared = await sharedServices.getAllShared();
        res.json(allShared);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

module.exports = {
  createShared,
  deleteShared,
  updateRecipientsMail,
  searchSharedByColumn,
  searchSharedByDate,
  searchSharedByRecipientsMail,
  getAllShared
};
