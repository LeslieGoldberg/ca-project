from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pprint

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']


class UsernameGenerator:
    """
    Takes a list of names and grade-levels from a Google Form Response spreadsheet and a given list of usernames and
    writes a matched list of Names and grade-specific usernames into a different sheet of that spreadsheet.
    """
    def __init__(self):
        pass

    def get_service(self):
        """
        Connects to Google Sheets API using OAuth 2.0 token
        :return:
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
                    'client_id.json', SCOPES)
                creds = flow.run_local_server(port=0)
            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)

        service = build('sheets', 'v4', credentials=creds)
        return service

    def get_username_sheet(self, service):
        """
        Creating a ValueRange object from Login Cards Master spreadsheet.
        """
        range_name = ['Sheet2!A3:I']
        spreadsheet_id = '1Mdj3bOHrA9qq2D-N7Oj8tglEc8m90pYtfAA-V8fjd8o'
        result = service.spreadsheets().values().batchGet(
            spreadsheetId=spreadsheet_id, ranges=range_name, majorDimension='COLUMNS').execute()
        ranges = result.get('valueRanges', [])
        print('Usernames retrieved.')
        return ranges

    def get_grade_levels_and_names(self, service):
        """
        Creates ValueRange object from the Grade-level and Name columns in Welcome Form Response spreadsheet
        :return:
        """
        range_name = ['Form Responses 2!B2:C']
        spreadsheet_id = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8'
        result = service.spreadsheets().values().batchGet(
            spreadsheetId=spreadsheet_id, ranges=range_name, majorDimension='COLUMNS').execute()
        ranges = result.get('valueRanges', [])
        print('{0} Grades and Names retrieved.'.format(len(ranges)))
        return ranges

    def kinder_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][0]:
            yield username

    def first_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][1]:
            yield username

    def second_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][2]:
            yield username

    def third_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][3]:
            yield username

    def fourth_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][4]:
            yield username

    def fifth_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][5]:
            yield username

    def sixth_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][6]:
            yield username

    def seventh_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][7]:
            yield username

    def eighth_yield(self, username_valuerange):
        for username in username_valuerange[0]['values'][8]:
            yield username

    def match_grades_with_passwords(self, grade_levels, username_valuerange):
        """
        Iterates through the list of grade levels and creates a list of matching usernames.
        :param grade_levels: List of grade levels from Welcome Spreadsheet
        :param username_valuerange: ValueRange object of grade-specific usernames from Login Cards Master Spreadsheet
        :return: list of grade-matched usernames
        """
        username_list = []
        for grade in grade_levels:
            if grade == 'Kindergarten':
                username_list.append(next(self.kinder_yield(username_valuerange)))
            elif grade == 'Grade 1':
                username_list.append(next(self.first_yield(username_valuerange)))
            elif grade == 'Grade 2':
                username_list.append(next(self.second_yield(username_valuerange)))
            elif grade == 'Grade 3':
                username_list.append(next(self.third_yield(username_valuerange)))
            elif grade == 'Grade 4':
                username_list.append(next(self.fourth_yield(username_valuerange)))
            elif grade == 'Grade 5':
                username_list.append(next(self.fifth_yield(username_valuerange)))
            elif grade == 'Grade 6':
                username_list.append(next(self.sixth_yield(username_valuerange)))
            elif grade == 'Grade 7':
                username_list.append(next(self.seventh_yield(username_valuerange)))
            elif grade == 'Grade 8':
                username_list.append(next(self.eighth_yield(username_valuerange)))
            else:
                username_list.append('')
        return username_list

    def write_names_and_usernames(self, service, names_list, username_list):
        """
        Writes names and matching passwords into their own sheet in the Welcome spreadsheet
        :return:
        """
        values = [names_list, username_list]
        range_name = 'NamesAndUserNames!A2:B'
        body = {
            'majorDimension': 'COLUMNS',
            'range': range_name,
            'values': values
        }
        spreadsheet_id = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8'
        result = service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id, range=range_name,
            valueInputOption='USER_ENTERED', body=body).execute()
        print('{0} cells updated.'.format(result.get('updatedCells')))

    # def append_username_to_column():
    #     values = [
    #         [
    #             # Cell value ...
    #         ],
    #     ]
    #     body = {
    #         'values': values
    #     }
    #     spreadsheet_id = '1GD5UBfEcWwxopL3pS7t4MIjFWFzk_NsPXT24T1JxVa8'
    #     result = service.spreadsheets().values().append(
    #         spreadsheetId=spreadsheet_id, range=range_name,
    #         valueInputOption=value_input_option, body=body).execute()
    #     print('{0} cells appended.'.format(result \
    #                                        .get('updates') \
    #                                        .get('updatedCells')))

    def main(self):
        """
        Gets API permission using OAuth 2.0 token.
        Reads Usernames as a ValueRange object.
        Reads Grade-levels and Names as a ValueRange object.
        Uses the Grade-levels to return a list of Usernames.
        Writes the Names with matching Usernames into a google sheet.
        :return:
        """
        service = self.get_service()
        username_values = self.get_username_sheet(service)
        grade_levels_and_names = self.get_grade_levels_and_names(service)
        grade_levels = grade_levels_and_names[0]['values'][0]
        names = grade_levels_and_names[0]['values'][1]
        username_list = self.match_grades_with_passwords(grade_levels, username_values)
        self.write_names_and_usernames(service, names, username_list)


if __name__ == '__main__':
    generator = UsernameGenerator()
    generator.main()
