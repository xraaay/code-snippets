        public async Task<HttpStatusCode> SendAppointmentEmail(Appointment appointment)
        {
            User requester = null;
            User guest = null;
            _dataProvider.ExecuteCmd(
                "Users_Select_ById",
                cmd =>
                {
                    cmd.AddWithValue("@Id", appointment.RequesterId);
                },
                (reader, read) =>
                {
                    requester = new User()
                    {
                        Email = (string)reader["Email"],
                        FirstName = (string)reader["FirstName"],
                        LastName = (string)reader["LastName"]
                    };
                });
            _dataProvider.ExecuteCmd(
                "Users_Select_ById",
                cmd =>
                {
                    cmd.AddWithValue("@Id", appointment.GuestId);
                },
                (reader, read) =>
                {
                    guest = new User()
                    {
                        Email = (string)reader["Email"],
                        FirstName = (string)reader["FirstName"],
                        LastName = (string)reader["LastName"]
                    };
                });
            string htmlContent = @"
                                <div>
                                    <h2>Pathways Appointment Requested</h2>
                                    <p>" + requester.FirstName + " has invited you to " + appointment.Description + " at " + appointment.Location + " on " + appointment.AppointmentDate + @".
                                    <br><br> <span style=""color: #000000"" >Please Click the link below to verify appointment.<span> <br>
                                    <a href=""http://localhost:3000/appointments/user/confirm/" + appointment.Id + @"""><h3>Confirm Appointment</h3></a>
                                        <a href=""https://calendar.yahoo.com/?v=60&view=d&type=20
                                        &title=" + appointment.Description + @"
                                        &st=" + appointment.AppointmentDate.ToString("yyyyMMdd"+"T"+"HHmmss") + @"
                                        & et=" + appointment.AppointmentEndDate.ToString("yyyyMMdd"+"T"+"HHmmss") + @"
                                        &desc=" + appointment.Description + @"
                                        &in_loc=" + appointment.Location + @"
                                        "">add to Yahoo calendar</a>
                                    <a href=""http://www.google.com/calendar/event
                                        ?action = TEMPLATE
                                        & text = " + appointment.Description + @"
                                        &dates=[start-custom format='" + appointment.AppointmentDate + "']/[end-custom format='" + appointment.AppointmentEndDate + @"']
                                        &details=" + appointment.AppointmentEndDate + @"
                                        &location=" + appointment.Location + @"
                                        &trp=false
                                        &sprop=
                                        &sprop=name:""
                                        target=""_blank"" rel=""nofollow""></a>
                                </div>";
            var apiKey = ConfigurationManager.AppSettings["SendGridApiKey"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(requester.Email, requester.FirstName + " " + requester.LastName);
            var to = new EmailAddress("c60@dispostable.com", guest.FirstName);
            var subject = "Pathways Appointment";
            var plainTextContent = appointment.Description;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            string CalendarContent = MeetingRequestString("LA Pathways", new List<string>() { guest.FirstName }, appointment.Description + " at " + appointment.Location, appointment.Description, appointment.Location, appointment.AppointmentDate, appointment.AppointmentEndDate);
            byte[] calendarBytes = Encoding.UTF8.GetBytes(CalendarContent.ToString());
            SendGrid.Helpers.Mail.Attachment calendarAttachment = new SendGrid.Helpers.Mail.Attachment
            {
                Filename = "AddToCalendar.ics",
                Content = Convert.ToBase64String(calendarBytes),
                Type = "text/calendar"
            };
            msg.AddAttachment(calendarAttachment);
            Response response = await client.SendEmailAsync(msg);
            return response.StatusCode;
        }
