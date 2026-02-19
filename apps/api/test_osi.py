from main import solve_doubt, DoubtRequest

def test_osi_hardcoded():
    print("Running OSI Hardcoded Check...")
    
    # Test case 1: "Explain OSI Model"
    try:
        req = DoubtRequest(student_id="test", question_text="Explain OSI Model")
        response = solve_doubt(req)
        
        if "7 distinct layers" in response["answer"] and "Application Layer" in response["answer"]:
            print("✅ Test 1 Passed: 'Explain OSI Model' returned hardcoded text.")
        else:
            print("❌ Test 1 Failed: Response did not contain expected text.")
            print("Response snippet:", response["answer"][:100])
            
    except Exception as e:
        print(f"❌ Test 1 Error: {e}")

    # Test case 2: "what is osi" (case insensitive check)
    try:
        req = DoubtRequest(student_id="test", question_text="what is osi?")
        response = solve_doubt(req)
        
        if "7 distinct layers" in response["answer"]:
            print("✅ Test 2 Passed: 'what is osi?' returned hardcoded text.")
        else:
            print("❌ Test 2 Failed: Response did not contain expected text.")
            
    except Exception as e:
        print(f"❌ Test 2 Error: {e}")

if __name__ == "__main__":
    test_osi_hardcoded()
