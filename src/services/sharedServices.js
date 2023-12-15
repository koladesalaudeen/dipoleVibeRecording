const Shared = require("../models/shared");
const User = require("../models/user")
const { uploadVideo } = require('./videoServices');
const { sendReminderMail, sendInviteMail } = require("./mailServices");

// Create a new Shared document
async function findUsersByEmail(recipientsMail) {
    try {
      const users = await User.find({ email: { $in: recipientsMail } });
      return users;
    } catch (error) {
      throw error;
    }
}

async function createSharedItem(author, videoURL, recipientsMail, title, summary) {
    try {
      const newShared = await Shared.create({
        userId: author,
        videoURL: videoURL,
        recipientsMail,
        title,
        summary
      });
  
      await newShared.save();
      return newShared;
    } catch (error) {
      throw error;
    }
}

async function sendReminderEmails(recipientsMail) {
    try {
      recipientsMail.forEach((mail) => {
        sendReminderMail(mail);
      });
    } catch (error) {
      throw error;
    }
}

async function sendInviteEmails(author,recipientsMail) {
    try {
      recipientsMail.forEach((mail) => {
        sendInviteMail(author, mail);
      });
    } catch (error) {
      throw error;
    }
}

async function createShared(author, videoBuffer, recipientsMail, title, summary) {
  try {
    const videoURL = await uploadVideo(videoBuffer);
    
    const users = await findUsersByEmail(recipientsMail);

    const newShared = await createSharedItem(author, videoURL, recipientsMail, title, summary);
    
    await sendInviteEmails(author,recipientsMail);

    return { 
      message: 'video shared successfully',
      videoData: newShared
     };
  } catch (error) {
    throw error;
  }
}

async function searchSharedByColumn(columnName, columnValue) {
    try {
      const query = {};
      query[columnName] = columnValue;
  
      const matchingSharedDocuments = await Shared.find(query);
      return matchingSharedDocuments;
    } catch (error) {
      throw error;
    }
}
  
  // Search for Shared documents created on or after a specific date
async function searchSharedByDate(startDate) {
    try {
      const query = { createdAt: { $gte: startDate } };
  
      const matchingSharedDocuments = await Shared.find(query);
      return matchingSharedDocuments;
    } catch (error) {
      throw error;
    }
}

// Delete a Shared document by ID
async function deleteSharedById(sharedId) {
  try {
    const deletedShared = await Shared.findByIdAndDelete(sharedId);
    return deletedShared;
  } catch (error) {
    throw error;
  }
}

// Update recipientsMail for a Shared document by ID
async function updateRecipientsMail(sharedId, newRecipientsMail) {
  try {
    const updatedShared = await Shared.findByIdAndUpdate(
      sharedId,
      { recipientsMail: newRecipientsMail },
      { new: true } // Return the updated document
    );
    return updatedShared;
  } catch (error) {
    throw error;
  }
}

async function searchSharedByRecipientsMail(recipientsMail) {
    try {
      const query = { recipientsMail: { $in: recipientsMail } };
      const matchingSharedDocuments = await Shared.find(query);
      return matchingSharedDocuments;
    } catch (error) {
      throw error;
    }
}

async function getAllShared() {
    try {
      const allSharedDocuments = await Shared.find();
      return allSharedDocuments;
    } catch (error) {
      throw error;
    }
}

module.exports = {
  createShared,
  searchSharedByColumn,
  searchSharedByDate,
  deleteSharedById,
  updateRecipientsMail,
  searchSharedByRecipientsMail,
  getAllShared
};
