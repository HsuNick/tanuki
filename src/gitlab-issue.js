import moment from 'moment';

export default class GitlabIssue {
  constructor(data) {
    this.link = data.hasOwnProperty('web_url') ? data.web_url : null;
    this.id = data.hasOwnProperty('id') ? data.id : null;
    this.iid = data.hasOwnProperty('id') ? data.iid : null;
    this.state = data.hasOwnProperty('state') ? data.state : null;
    this.title = data.hasOwnProperty('title') ? data.title : null;
    this.author = data.hasOwnProperty('author') ? data.author.name : null;
    this.assignee = data.hasOwnProperty('assignee') ? GitlabIssue.transformAssignee(data.assignee) : null;
    this.labels = data.hasOwnProperty('labels') ? GitlabIssue.transformLabels(data.labels) : null;
    this.description = data.hasOwnProperty('description') ? data.description : null;
    this.created_at = data.hasOwnProperty('created_at') ? GitlabIssue.transform_dateStyle(data.created_at) : null;
    this.updatedAt = data.hasOwnProperty('updated_at') ? GitlabIssue.transform_dateStyle(data.updated_at) : null;
    this.due_date = data.hasOwnProperty('due_date') ? data.due_date : null;
    this.closed_at = data.hasOwnProperty('closed_at') ? GitlabIssue.transform_dateStyle(data.closed_at) : null;
    this.milestone = data.hasOwnProperty('milestone') ? data.milestone : null;
    this.time_estimate = data.hasOwnProperty('time_stats') ? data.time_stats.human_time_estimate : null;
    this.time_spent = data.hasOwnProperty('time_stats') ? data.time_stats.human_total_time_spent : null;
  }

  static getIdByIssuesUrl(url) {
    let regex = new RegExp('^(https?:\\/\\/)(((.[^./]+[.])[^./]+)+)(\\/)(([^./]+)(\\/))+(issues\\/)([0-9]+)');
    let result = regex.exec(url);
    return result[10];
  }

  static transform_dateStyle(date) {
    if ( date == '' || date == null || date == undefined) {
      return null;
    } else {
      let newDate = date.split(/[T. ]/);
      return newDate[0] + ' ' + newDate[1];
    }
  }

  static transformLabels(labels) {
    if (labels in Array) {
      return labels.map(label => {
        return label;
      });
    } else {
      return labels;
    }
  }

  static transformAssignee(assignee) {
    if ( assignee == '' || assignee == null || assignee == undefined) {
      return null;
    } else {
      return assignee.name;
    }
  }
}
