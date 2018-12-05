<!-- Display error handling and success/failure messages here -->
<!-- This file is included in other views/templates -->

@if ($errors)
    @foreach ($errors->all() as $error)
    <p>{{$error}}</p>
    @endforeach
@endif

@if (session('success'))
    {{session('success')}}
@endif

@if (session('failure'))
    {{session('failure')}}
@endif