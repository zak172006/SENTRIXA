// SENTRIXA - Backup Service

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const backupService = {

    // Create Backup Directory
    getBackupDirectory: () => {

        const backupDirectory = path.join(
            process.cwd(),
            "backups"
        );

        if (!fs.existsSync(backupDirectory)) {
            fs.mkdirSync(backupDirectory, {
                recursive: true
            });
        }

        return backupDirectory;
    },

    // Export Database Collections
    createBackup: async () => {

        try {

            if (mongoose.connection.readyState !== 1) {
                throw new Error("Database is not connected");
            }

            const backupDirectory =
                backupService.getBackupDirectory();

            const timestamp = new Date()
                .toISOString()
                .replace(/[:.]/g, "-");

            const backupData = {};

            const collections =
                await mongoose.connection.db
                    .listCollections()
                    .toArray();

            for (const collection of collections) {

                const collectionName = collection.name;

                const documents =
                    await mongoose.connection.db
                        .collection(collectionName)
                        .find({})
                        .toArray();

                backupData[collectionName] = documents;
            }

            const backupFile = path.join(
                backupDirectory,
                `sentrixa-backup-${timestamp}.json`
            );

            fs.writeFileSync(
                backupFile,
                JSON.stringify(backupData, null, 2),
                "utf8"
            );

            return {
                success: true,
                message: "Backup created successfully",
                file: backupFile,
                collections: collections.length
            };

        } catch (error) {

            throw new Error(
                "Backup failed: " + error.message
            );

        }

    },

    // List Available Backups
    listBackups: () => {

        try {

            const directory =
                backupService.getBackupDirectory();

            return fs.readdirSync(directory)
                .filter(file =>
                    file.startsWith("sentrixa-backup-") &&
                    file.endsWith(".json")
                )
                .map(file => ({
                    name: file,
                    path: path.join(directory, file)
                }));

        } catch (error) {

            throw new Error(
                "Failed to list backups: " + error.message
            );

        }

    },

    // Delete Backup
    deleteBackup: (fileName) => {

        try {

            if (
                typeof fileName !== "string" ||
                !/^sentrixa-backup-[\w-]+\.json$/.test(fileName)
            ) {
                throw new Error("Invalid backup filename");
            }

            const directory =
                backupService.getBackupDirectory();

            const backupPath = path.join(
                directory,
                fileName
            );

            if (!fs.existsSync(backupPath)) {
                throw new Error("Backup file not found");
            }

            fs.unlinkSync(backupPath);

            return {
                success: true,
                message: "Backup deleted successfully"
            };

        } catch (error) {

            throw new Error(
                "Failed to delete backup: " + error.message
            );

        }

    }

};

module.exports = backupService;