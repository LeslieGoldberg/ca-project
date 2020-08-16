from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pprint

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']


def get_username_sheet(service):
    """
    Creating a ValueRange object from Login Cards Master spreadsheet.
    """
    range_names = [
        'Sheet2!A3:I'
    ]
    spreadsheet_id = '1Mdj3bOHrA9qq2D-N7Oj8tglEc8m90pYtfAA-V8fjd8o'
    result = service.spreadsheets().values().batchGet(
        spreadsheetId=spreadsheet_id, ranges=range_names, majorDimension='COLUMNS').execute()
    ranges = result.get('valueRanges', [])
    pp = pprint.PrettyPrinter(indent=1)
    print('Usernames retrieved.'.format(len(ranges)))
    # pp.pprint(ranges)
    return ranges


def get_grade_levels_and_names(service):
    """
    Reads the grade level column from Welcome spreadsheet
    :return:
    """
    range_name = ['Sheet5!F3:G25']
    spreadsheet_id = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8'
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, range=range_name, majorDimension='COLUMNS').execute()
    ranges = result.get('valueRanges', [])
    pp = pprint.PrettyPrinter(indent=1)
    print('{0} ranges retrieved.'.format(len(ranges)))
    pp.pprint(ranges)
    return ranges


def write_passwords_in_column():
    """
    (Batch) Writes passwords list into a column in the Welcome spreadsheet
    :return:
    """
    values = [
        [
            # Cell values ...
        ]
    ]
    body = {
        'range': 'Sheet1!B:B',
        'majorDimension': 'COLUMNS',
        'values': values
    }
    spreadsheet_id = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8'
    result = service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id, range=range_name,
        valueInputOption=value_input_option, insertDataOption=INSERT_COLUMNS, body=body).execute()
    print('{0} cells updated.'.format(result.get('updatedCells')))


def append_username_to_column():
    values = [
        [
            # Cell value ...
        ],
    ]
    body = {
        'values': values
    }
    spreadsheet_id = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8'
    result = service.spreadsheets().values().append(
        spreadsheetId=spreadsheet_id, range=range_name,
        valueInputOption=value_input_option, body=body).execute()
    print('{0} cells appended.'.format(result \
                                       .get('updates') \
                                       .get('updatedCells')))


def main():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'client_secret_169976153081-e88rpdtbuu3vdjckli3jlmit5ovst8ap.apps.googleusercontent.com.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    username_values = get_username_sheet(service)
    grade_levels_and_names = get_grade_levels_and_names(service)

    # # Call the Sheets API
    # sheet = service.spreadsheets()
    # result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
    #                             range=SAMPLE_RANGE_NAME).execute()
    # values = result.get('values', [])
    #
    # if not values:
    #     print('No data found.')
    # else:
    #     print('Name, Major:')
    #     for row in values:
    #         # Print columns A and E, which correspond to indices 0 and 4.
    #         print('%s, %s' % (row[0], row[4]))


if __name__ == '__main__':
    main()