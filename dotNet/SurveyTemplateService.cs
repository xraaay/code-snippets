using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.SurveyTemplate;
using Sabio.Models.Requests.SurveyInstance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class SurveyTemplateService
    {
        IDataProvider _dataProvider;

        public SurveyTemplateService (IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public TemplateSurvey ReadAll(int id)
        {
            TemplateSurvey survey = null;
            TemplateSection section = null;
            List<TemplateSection> sectionList = new List<TemplateSection>();
            List<TemplateQuestions> questionsList = new List<TemplateQuestions>();
            _dataProvider.ExecuteCmd(
                "SurveyTemplate_SSQ_Join",
                cmd =>
                {
                    cmd.AddWithValue("@Id", id);
                },
                (reader, read) =>
                {
                    survey = new TemplateSurvey()
                    {
                        Id = (int)reader["SurveyId"],
                        Name = (string)reader["Name"],
                        Description = (string)reader["SurveyDescription"],
                        TypeId = (int)reader["SurveyTypeId"],
                        StatusId = (int)reader["SurveyStatusId"],
                        OwnerId = (int)reader["SurveyOwnerId"],
                    };
                    object version = reader["Version"];
                    if(version == DBNull.Value)
                    {
                        survey.Version = 0;
                    } else
                    {
                        survey.Version = (int)version;
                    }
                    TemplateSection sectionTemplate = new TemplateSection()
                    {
                        Id = (int)reader["SectionId"],
                        Title = (string)reader["Title"],
                        Description = (string)reader["SectionDescription"],
                        SortOrder = (int)reader["SectionSortOrder"]
                    };
                    TemplateQuestions question = new TemplateQuestions()
                    {
                        Id = (int)reader["QuestionId"],
                        Question = (string)reader["Question"],
                        SortOrder = (int)reader["QuestionSortOrder"],
                        HelpText = (string)reader["HelpText"],
                        IsRequired = (bool)reader["IsRequired"],
                        IsMultipleAllowed = (bool)reader["IsMultipleAllowed"],
                        QuestionTypeId = (int)reader["QuestionTypeId"],
                        StatusId = (int)reader["StatusId"],
                        UserId = (int)reader["UserId"],
                        AnswerOptions = new List<TemplateAnswerOption>()
                    };
                    questionsList.Add(question);
                    sectionTemplate.Questions = questionsList;
                    section = sectionTemplate;
                });
            sectionList.Add(section);
            survey.Sections = sectionList;
            return survey;
        }

        public TemplateSurvey GetAnswers(TemplateSurvey survey)
        {
            var questions = survey.Sections[0].Questions;
            DataTable dataTable = new DataTable();
            dataTable.Columns.Add("Id");
            DataRow dataRow = null;

            for(int i = 0; i < questions.Count; i++)
            {
                dataRow = dataTable.NewRow();
                dataRow["Id"] = questions[i].Id;
                dataTable.Rows.Add(dataRow);
            }

            _dataProvider.ExecuteCmd(
                "SurveyTemplate_Answers",
                cmd =>
                {
                    SqlParameter param = cmd.AddWithValue("Questions", dataTable);
                    param.SqlDbType = SqlDbType.Structured;
                },
                (reader, read) =>
                {
                    TemplateAnswerOption answer = new TemplateAnswerOption()
                    {
                        Id = (int)reader["Id"], 
                        Text = (string)reader["Text"],
                        Value = (string)reader["Value"],
                        AdditionalInfo = (string)reader["AdditionalInfo"],
                        UserId = (int)reader["UserId"],
                        QuestionId = (int)reader["QuestionId"]
                    };
                    questions.Find(x => x.Id == answer.QuestionId).AnswerOptions.Add(answer);
                });
            return survey;
        }

    }
}
