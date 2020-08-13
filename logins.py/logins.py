def get_username_sheet():
    """
    Creating a ValueRange object from Login Cards Master spreadsheet.
    """
    range_names = [
        'Sheet1!B:B', 'Sheet1!D:D', 'Sheet1!F:F', 'Sheet1!H:H', 'Sheet1!J:J', 'Sheet1!L:L',
        'Sheet1!N:N', 'Sheet1!P:P', 'Sheet1!R:R'
    ]
    spreadsheet_id = '1Mdj3bOHrA9qq2D-N7Oj8tglEc8m90pYtfAA-V8fjd8o'
    result = service.spreadsheets().values().batchGet(
        spreadsheetId=spreadsheet_id, ranges=range_names).execute()
    ranges = result.get('valueRanges', [])
    print('{0} ranges retrieved.'.format(len(ranges)))
    print(ranges)


def get_grade_levels():
    """
    Reads the grade level column from Welcome spreadsheet
    :return:
    """


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
        'majorDimension': enum(COLUMNS),
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