import axios from 'axios';
import { xml2js, json2xml } from 'xml-js';
import GitlabIssue from './gitlab-issue';

export default class GitlabIssuesRssFeed {
  constructor() {
    this.issuesList = [];
  }

  getUrl() {
    let url = new URL(window.location.href);
    return url;
  }

  getDomain() {
    let domain = this.getUrl().origin;
    return domain;
  }

  getType(value) {
    if (value == 0) {
      return 'projects/'
    } else {
      return 'groups/'
    }
  }

  getApiUrl() {
    // get ID
    let elementId = document.querySelector('header.navbar-gitlab div.search-form input#search_project_id');
    let type = 0;
    if (elementId.value == '' || elementId.value == null || elementId.value == undefined) {
      elementId = document.querySelector('header.navbar-gitlab div.search-form input#group_id');
      type = 1;
      return this.getDomain()+'/api/v4/'+this.getType(type)+elementId.value+'/issues?per_page=100&page='
    }
    return this.getDomain()+'/api/v4/'+this.getType(type)+elementId.value+'/issues?per_page=100&page='
  }

  fetchIssuesList() {
    let page = 1;
    let issueList = [];
    return this.fetchIssueList(issueList, page);
  }

  fetchIssueList(issuesList, page) {
    let issusURL = this.getApiUrl()+page;
    let downloading = this.downloads(issusURL);
    let self = this;

    return new Promise(resolve => {
      downloading.then(issues => {
        page++;
        let filtered = issues;
        // let filtered = issues.filter(currentIssue => {
        //   let result = issuesList.find(issue => {
        //     return issue.id === currentIssue.id;
        //   });
        //   return !result;
        // });

        issuesList = issuesList.concat(filtered);
        // console.log(issuesList.concat(filtered));
        if (filtered.length !== 0) {
          return resolve(self.fetchIssueList(issuesList, page));
        }

        return resolve(issuesList);
      });
    });
  }

  downloads(url) {
    return axios.get(url).then(response => {
      let json = response.data;
      let gitlabIssues = json.map(item => {
        return new GitlabIssue(item);
      });
      return gitlabIssues;
    });
  }
}
