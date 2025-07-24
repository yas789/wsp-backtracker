package backtracking;

import java.util.ArrayList;
import java.util.List;
//One thing to note is that this code in this file CombinationSum.java is not my code but I have written it  to understand the concept of backtracking and how it can be used to solve other problems like the vertex cover problem.
//in fact there is a website called neetcode where i have found this code and i have written it to understand the concept of backtracking.
class CombinationSum {
    public List<List<Integer>> combinationSum(int[] nums, int target) {
        List<List<Integer>> ans = new ArrayList<>();
        List<Integer> cur = new ArrayList<>();
        int index = 0;
        backtrack(index , target , cur , ans , nums);
        return ans;
        
    }
    public void backtrack( int index , int target , List<Integer> cur , List<List<Integer>> ans , int[] nums){

        if (target < 0 || index == nums.length){
            return;
        }
        if (target == 0){
            ans.add(new ArrayList<>(cur));
            return;
        }
        else {
            cur.add(nums[index]);
            backtrack(index , target - nums[index] , cur , ans , nums);

            cur.remove(cur.size() - 1);
            backtrack (index + 1 , target , cur , ans , nums);
        }
        
    }








public static void main(String[] args) {
    CombinationSum cs = new CombinationSum();
    int[] nums = {2, 3, 6, 7};
    int target = 8;
    System.out.println(cs.combinationSum(nums , target));


}
}
