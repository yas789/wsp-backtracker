package com.fyp.wspapi.domain;

/**
 * Represents the type of constraint between two steps in the workflow.
 */
public enum ConstraintType {
    /**
     * The two steps must be assigned to the same user.
     */
    MUST_SAME,
    
    /**
     * The two steps must be assigned to different users.
     */
    MUST_DIFFERENT
}
