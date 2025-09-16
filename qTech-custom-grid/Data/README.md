# JSON Data Storage

This application now uses JSON files for data storage instead of a SQL database. The data is stored in `data.json` and can be modified at runtime.

## Data Structure

The JSON file contains three main collections:

### Users
- Contains user employee data
- Each user has properties like name, identity number, bank account, etc.
- Navigation properties (Bank, MaritalStatus) are populated at runtime

### Banks
- Contains bank information for dropdown selections
- Used in user bank selection

### Marital Statuses
- Contains marital status options for dropdown selections
- Used in user marital status selection

## Runtime Modifications

The JSON data file can be modified while the application is running. Changes will be reflected immediately when:
- Adding new users, banks, or marital statuses
- Updating existing records
- Deleting records

## File Location

The data file is located at: `qTech-custom-grid/Data/data.json`

## Thread Safety

All JSON operations are thread-safe using file locking mechanisms to prevent data corruption during concurrent access.

## Backup

It's recommended to backup the `data.json` file regularly since it contains all application data.
