import { JSONOutput } from 'typedoc';
import { doclink } from '../utils';

export abstract class AbstractSerializer {
    public constructor(public declaration: JSONOutput.DeclarationReflection) {}

    public serialize() {}

    protected _parseCommentLink(comment: JSONOutput.CommentDisplayPart) {
        const hasLink = comment.kind == 'inline-tag' && comment.tag == '@link'
        return hasLink ? doclink(comment.text) : comment.text;
    }
}
