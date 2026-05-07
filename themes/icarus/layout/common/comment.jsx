const createLogger = require('hexo-log');
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

const logger = createLogger.default();

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __ } = helper;
        const { comment } = config;
        if (!comment || typeof comment.type !== 'string') {
            return null;
        }

        // 为utterances评论生成配置数据
        let commentConfig = '';
        if (comment.type === 'utterances' && comment.repo) {
            const uttConfig = {
                repo: comment.repo,
                'issue-term': comment.issue_term || 'title',
                theme: comment.theme || 'github-light',
                crossorigin: 'anonymous',
                async: true
            };
            if (comment.label) {
                uttConfig.label = comment.label;
            }
            commentConfig = JSON.stringify(uttConfig);
        }

        return <div class="card" id="comments">
            <div class="card-content">
                <h3 class="title is-5">{__('article.comments')}</h3>
                <div class="comment-container" data-comment-type={comment.type} data-comment-config={commentConfig}>
                    {(() => {
                        try {
                            let Comment = view.require('comment/' + comment.type);
                            Comment = Comment.Cacheable ? Comment.Cacheable : Comment;
                            return <Comment config={config} page={page} helper={helper} comment={comment} />;
                        } catch (e) {
                            logger.w(`Icarus cannot load comment "${comment.type}"`);
                            return null;
                        }
                    })()}
                </div>
            </div>
        </div>;
    }
};
