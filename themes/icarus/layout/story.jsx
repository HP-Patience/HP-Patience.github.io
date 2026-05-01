const { Component, Fragment } = require('inferno');
const Paginator = require('hexo-component-inferno/lib/view/misc/paginator');
const Article = require('./common/article');

module.exports = class extends Component {
  render() {
    const { config, page, helper } = this.props;
    const { __, url_for } = helper;

    return <Fragment>
      <div class="card">
        <div class="card-content">
          <h1 class="title is-3">📖 Story</h1>
          <p class="content">这里记录我的日常生活与经历，分享那些值得铭记的时刻。</p>
        </div>
      </div>
      {page.posts && page.posts.length ? page.posts.map(post => <Article config={config} page={post} helper={helper} index={true} />) : null}
      {page.total > 1 ? <Paginator
        current={page.current}
        total={page.total}
        baseUrl={page.base}
        path={config.pagination_dir}
        urlFor={url_for}
        prevTitle={__('common.prev')}
        nextTitle={__('common.next')} /> : null}
    </Fragment>;
  }
};
