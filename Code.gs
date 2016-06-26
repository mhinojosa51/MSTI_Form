function doGet() {
    return HtmlService.createHtmlOutputFromFile('MSTIForm')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


function getData(data) {
    var folder = DriveApp.getFolderById('YOUR_FOLDER_ID');

    var firstName = data['user-firstname'];
    var lastName = data['user-lastname'];
    var middleName = data['user-middlename'];
    var otterId = data['user-id'];
    var email = data['user-email'];
    var street = data['user-street'];
    var address = data['user-address'];
    var userAddress = street + ' ' + address;
    var phone = data['user-telephone'];
    var demographic = data['user-demographic'];
    var other = data['user-other'];
    var gender = data['user-gender'];
    var gpaSixty = data['user-gpa60'];
    var subject = data['user-subject'];
    var cummulativeGPA = data['user-cummulativegpa'];
    var fafsa = data['user-fafsa'];
    var expOne = data['user-exp1'];
    var expTwo = data['user-exp2'];
    var expThree = data['user-exp3'];
    var expFour = data['user-exp4'];
    var roleModel = data['user-rolemodel'];
    var studentName = firstName + ' ' + middleName + ' ' + lastName;

    Logger.log(firstName);
    Logger.log(demographic);
    Logger.log(demographic == 'Other');

    if (demographic == 'Other') {
        demographic = other;
    }

    var contentAnswers = [studentName, otterId, email, userAddress, phone, demographic, gender, gpaSixty, subject, cummulativeGPA, fafsa, expOne, expTwo, expThree, expFour, roleModel];

    var contentFields = ['Applicant Name', 'OtterID', 'Email', 'Address', 'Phone Number', 'Demographic Data', 'Gender', 'GPA of last 60 units', 'Subject Area (s)', 'Cumulative GPA', 'FAFSA Completion', 'Service Experience One',
                        'Service Experience Two', 'Service Experience Three', 'Service Experience Four', 'Potential as a Role Model'];


    var responsePairs = [];

    for (var i = 0; i < contentAnswers.length; i++) {
        responsePairs.push([contentFields[i], contentAnswers[i]]);
    }

    /*
    var fileContent = '';
    
    for(var i = 0; i < contentAnswers.length; i++){
      fileContent += '<b>' + contentFields[i] + '</b>:  ' + contentAnswers[i] + '\n\n';
    }
    
    
    folder.createFolder(studentName + ' Application');
    var studentFolder = folder.getFoldersByName(studentName + ' Application').next();
    studentFolder.createFile(studentName + ' Info', fileContent, MimeType.PLAIN_TEXT); */

    folder.createFolder(studentName + ' MSTI Application');
    var studentFolder = folder.getFoldersByName(studentName + ' MSTI Application').next();

    createDoc(contentFields, contentAnswers, studentFolder, studentName);
    emailResponse(responsePairs, email);

}


function createDoc(contentFields, contentAnswers, folderId, studentName) {

    var doc = DocumentApp.create(studentName + ' MSTI Application');
    var body = doc.getBody();

    for (var i = 0; i < contentFields.length; i++) {
        var field = contentFields[i];
        body.appendParagraph(contentFields[i] + ': ' + contentAnswers[i] + '\n');
        var paragraph = body.getParagraphs()[i + 1];
        paragraph.editAsText().setBold(0, field.length, true);
    }

    doc.saveAndClose();

    var file = DriveApp.getFileById(doc.getId());
    file.makeCopy(file.getName(), folderId);
    file.setTrashed(true);

}

function emailResponse(responsePairs, email) {
    var template = HtmlService.createTemplateFromFile('respondentNotification');
    template.name = responsePairs[0][1];
    template.data = responsePairs;
    var message = template.evaluate();

    var toSophia = "Hi Sophia\n\n" + responsePairs[0][1] + " has submitted an MSTI application";

    MailApp.sendEmail(email, 'MSTI Scholarship Application Confirmation', message.getContent(), { replyTo: 'svicuna@csumb.edu', htmlBody: message.getContent() });
    MailApp.sendEmail('svicuna@csumb.edu', 'MSTI Scholarship Application Submission', toSophia);

}